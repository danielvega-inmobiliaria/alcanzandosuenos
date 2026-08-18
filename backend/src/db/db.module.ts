import { Global, Module } from '@nestjs/common';
import { Pool } from 'pg';

export const PG_POOL = 'PG_POOL';

// Antes tenía un default hardcodeado `password: 'postgres'` — quedó sacado
// (pendiente de seguridad de Sesión 4, ver PROYECTO.md) ahora que la app va
// a tener autenticación real: la contraseña de la base siempre viene de una
// variable de entorno, nunca del código.
//
// Soporta dos formas de configurar la conexión:
// - `DATABASE_URL` (una sola connection string) — así entregan la conexión
//   Supabase, Railway, Render, etc. Se activa SSL automáticamente porque los
//   Postgres gestionados lo exigen.
// - Variables sueltas `PGHOST`/`PGPORT`/`PGUSER`/`PGPASSWORD`/`PGDATABASE` —
//   para desarrollo local contra un Postgres propio (ver `.env.example`).
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.PGSSL === 'false' ? false : { rejectUnauthorized: false },
    })
  : new Pool({
      host: process.env.PGHOST || 'localhost',
      port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE || 'alcanzandosuenos',
    });

// Módulo global: expone el Pool de conexión a Postgres para toda la app,
// en lugar de un ORM completo — el modelo de datos ya está en schema.sql
// (Arquitectura Técnica, sección 4) y las consultas son directas.
@Global()
@Module({
  providers: [{ provide: PG_POOL, useValue: pool }],
  exports: [PG_POOL],
})
export class DbModule {}
