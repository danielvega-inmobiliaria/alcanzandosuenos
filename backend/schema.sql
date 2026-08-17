-- Alcanzando Sueños — esquema de base de datos (PostgreSQL)
-- Traduce 1:1 el modelo de datos de la Arquitectura Técnica (sección 4)
-- a tablas reales, listas para Supabase, RDS o cualquier Postgres gestionado.

create extension if not exists "uuid-ossp";

-- ─── Usuario ────────────────────────────────────────────────────────────
create table usuario (
  id                uuid primary key default uuid_generate_v4(),
  nombre            text not null,
  email             text not null unique,
  fecha_alta        timestamptz not null default now(),
  -- preferencias de personalización (tema, fondo, estilo visual — Fase 2)
  preferencias      jsonb not null default '{}'::jsonb
);

-- ─── Meta ───────────────────────────────────────────────────────────────
create type meta_categoria as enum ('auto', 'casa', 'viaje', 'estudios', 'computadora', 'personal', 'personalizada');
create type meta_estado    as enum ('activa', 'completada', 'pausada');

create table meta (
  id                  uuid primary key default uuid_generate_v4(),
  usuario_id          uuid not null references usuario(id) on delete cascade,
  categoria           meta_categoria not null,
  titulo              text not null,
  monto_objetivo      numeric(14,2) not null check (monto_objetivo > 0),
  monto_actual        numeric(14,2) not null default 0 check (monto_actual >= 0),
  fecha_objetivo      date not null,
  aporte_periodico    numeric(14,2) not null,          -- calculado en el flujo "Crear meta" (Backlog Sprint 1)
  estado              meta_estado not null default 'activa',
  estilo_visual       text,                              -- Fase 2: personalización visual
  creada_en           timestamptz not null default now()
);
create index idx_meta_usuario on meta(usuario_id);

-- ─── Aporte ─────────────────────────────────────────────────────────────
create type aporte_origen as enum ('manual', 'recordatorio_cumplido');

create table aporte (
  id          uuid primary key default uuid_generate_v4(),
  meta_id     uuid not null references meta(id) on delete cascade,
  monto       numeric(14,2) not null check (monto > 0),
  fecha       date not null default current_date,
  origen      aporte_origen not null default 'manual'
);
create index idx_aporte_meta on aporte(meta_id);

-- ─── Paso (plan de acción) ──────────────────────────────────────────────
create type paso_estado as enum ('pendiente', 'completado');

create table paso (
  id                uuid primary key default uuid_generate_v4(),
  meta_id           uuid not null references meta(id) on delete cascade,
  descripcion       text not null,
  estado            paso_estado not null default 'pendiente',
  orden             integer not null default 0,
  fecha_completado  timestamptz
);
create index idx_paso_meta on paso(meta_id);

-- ─── Logro ──────────────────────────────────────────────────────────────
create type logro_tipo as enum ('primer_aporte', 'racha_30_dias', 'diez_por_ciento', 'cincuenta_por_ciento', 'noventa_por_ciento', 'meta_cumplida');

create table logro (
  id            uuid primary key default uuid_generate_v4(),
  usuario_id    uuid not null references usuario(id) on delete cascade,
  meta_id       uuid references meta(id) on delete set null,  -- opcional: algunos logros son globales
  tipo          logro_tipo not null,
  obtenido_en   timestamptz not null default now()
);
create index idx_logro_usuario on logro(usuario_id);

-- ─── Escenario de simulación (Fase 2 — simulador financiero) ────────────
-- No es un dato financiero real del usuario: es un resultado de cálculo
-- hipotético que se puede regenerar en cualquier momento (ver PRD, sección 8).
create table escenario_simulacion (
  id                    uuid primary key default uuid_generate_v4(),
  meta_id               uuid not null references meta(id) on delete cascade,
  tipo_instrumento       text not null,        -- 'cuenta_remunerada' | 'plazo_fijo' | 'cedears' | etc.
  tasa_hipotetica        numeric(6,4) not null, -- ej. 0.52 = 52% anual
  supuesto_inflacion     numeric(6,4),
  supuesto_tipo_cambio   numeric(6,4),
  resultado_proyectado   numeric(14,2) not null,
  generado_en            timestamptz not null default now()
);
create index idx_escenario_meta on escenario_simulacion(meta_id);

-- ─── Foto de usuario (Fase 1.5 — fotos propias, sin IA) ─────────────────
create type foto_tipo       as enum ('exterior', 'interior', 'fachada', 'ambiente', 'destino', 'otro');
create type foto_moderacion as enum ('pendiente', 'aprobada', 'rechazada');

create table foto_usuario (
  id                  uuid primary key default uuid_generate_v4(),
  meta_id             uuid not null references meta(id) on delete cascade,
  url                 text not null,
  tipo                foto_tipo not null,
  estado_moderacion   foto_moderacion not null default 'pendiente',
  subida_en           timestamptz not null default now()
);
create index idx_foto_meta on foto_usuario(meta_id);

-- ─── Generación de IA (Fase 2/3 — composición y experiencias avanzadas) ─
create type generacion_tipo   as enum ('composicion', 'video');
create type generacion_estado as enum ('en_cola', 'lista', 'fallida');

create table generacion_ia (
  id              uuid primary key default uuid_generate_v4(),
  meta_id         uuid not null references meta(id) on delete cascade,
  tipo            generacion_tipo not null,
  estado          generacion_estado not null default 'en_cola',
  url_resultado   text,
  costo_usd       numeric(8,4),                    -- para trackear consumo real por usuario y por plan (PRD 7.1)
  solicitada_en   timestamptz not null default now(),
  completada_en   timestamptz
);
create index idx_generacion_meta on generacion_ia(meta_id);

-- Fotos usadas en cada generación (relación muchos a muchos)
create table generacion_ia_foto (
  generacion_id   uuid not null references generacion_ia(id) on delete cascade,
  foto_id         uuid not null references foto_usuario(id) on delete cascade,
  primary key (generacion_id, foto_id)
);
