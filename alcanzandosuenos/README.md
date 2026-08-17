# Alcanzando Sueños — app (avance técnico)

Cuarto avance real del MVP: Sprint 0/1 (crear meta), Sprint 2 (tablero y
detalle), **Sprint 3 completo salvo la racha de 30 días** (mensaje dinámico
de seguimiento, hitos con logros automáticos, editar/pausar meta, recordatorios
locales) y el primer ítem de **Sprint 4** (referencias de precio al definir el
monto), todo contra un **backend real** (Node/NestJS + PostgreSQL). Corresponde
a los roles de **Diseñador/a UX/UI**, **Desarrollador/a mobile** y
**Desarrollador/a backend** del documento "Equipo Ideal".

## Qué incluye

- **`src/theme/tokens.js`** y **`src/components/`** — sistema de diseño
  (Button, Card, Chip, InputField, CategoryOption, ProgressDots, ProgressBar,
  Screen), consistente con el prototipo de validación.
- **`src/screens/CrearMeta/`** — las 4 pantallas del Sprint 1 (categoría →
  números → punto de partida → resultado) más la pantalla de fotos (Sprint 5).
  "Empezar mi meta" crea la meta contra el backend real y programa el
  recordatorio periódico de aporte (Sprint 3).
- **`src/screens/Tablero/TableroMetas.js`** (Sprint 2, Historia 1) — resumen
  general (metas activas/completadas/pausadas, progreso general) y filtro por
  estado, todo consumiendo la API real.
- **`src/screens/Tablero/DetalleMeta.js`** (Sprint 2 + Sprint 3) — plan de
  acción con pasos marcables, imagen del banco curado que cambia según el
  corte de progreso (0/25/50/75/100), registro de aportes, **edición del
  título**, **mensaje dinámico de seguimiento** ("si mantenés este ritmo,
  llegás X meses antes/después"), y un **banner con los hitos que se
  desbloquean** al registrar un aporte.
- **`src/utils/seguimiento.js`** — calcula el ritmo real de ahorro (monto
  juntado / tiempo transcurrido desde que se creó la meta) y lo compara contra
  la fecha objetivo.
- **`src/notifications/notificaciones.js`** — recordatorio periódico de aporte
  y aviso al desbloquear un hito, con `expo-notifications`. **Solo funciona en
  un dispositivo nativo (iOS/Android)**: la Web API de notificaciones del
  sistema operativo no existe en Expo web, así que en el navegador estas
  funciones no hacen nada (código defensivo, no un error). Probarlo de verdad
  requiere un dispositivo físico o un simulador — no se pudo verificar en este
  entorno de sandbox.
- **`src/api/client.js`** — cliente HTTP contra el backend (`EXPO_PUBLIC_API_URL`,
  por defecto `http://localhost:3000`).
- **`../backend/`** (carpeta hermana, fuera de este proyecto Expo) — API real
  en NestJS + PostgreSQL: usuarios, metas (crear/listar con filtros y
  resumen/detalle/editar/pausar), pasos (plan de acción, tildar/destildar),
  aportes (impactan el progreso al instante, completan la meta automáticamente)
  y **logros** (se otorgan solos al cruzar 10/50/90/100% de progreso y al
  primer aporte, dentro de la misma transacción que el aporte). **Probada de
  punta a punta**: corrida contra un Postgres real y ejercitada con la app
  corriendo en el navegador vía Playwright (crear meta → tablero → detalle →
  editar título → tildar paso → registrar aporte → ver 4 hitos desbloquearse
  de una → mensaje de seguimiento actualizado), sin errores de consola ni del
  servidor.
- **`src/data/referenciasPrecio.js`** (Sprint 4, Historia 1) — 2-3 referencias
  de precio curadas por categoría, mostradas en la pantalla "Contanos los
  números" al definir el monto, rotuladas como contenido curado (no un
  anuncio) y separadas visualmente del cálculo del plan. Tocar una referencia
  autocompleta el monto. **Los valores son ilustrativos de ejemplo, no precios
  de mercado reales** — hay que cargar referencias verdaderas antes de
  producción (ver comentario en el archivo).

## Qué falta (para quien tome esto desde acá)

- Racha de 30 días (logro `racha_30_dias`): necesita un job programado que
  mida actividad diaria, no un cálculo síncrono al registrar un aporte.
- Sprint 4 restante: beta cerrada con las 8 personas entrevistadas en la
  validación (el comparador liviano ya está).
- Autenticación (hoy la app opera con un único usuario demo creado
  automáticamente contra el backend, sin login — ver `USUARIO_DEMO` en
  `src/state/GoalWizardContext.js`).
- Desplegar el backend en un hosting real (Railway/Render/AWS, según
  Arquitectura Técnica) — hoy corre local en `http://localhost:3000`.
- Probar las notificaciones en un dispositivo real (ver limitación arriba) y,
  para push de verdad (no solo locales), configurar un proyecto de
  Firebase/EAS.

## Cómo correrlo

### Backend

```bash
cd backend
npm install
npm run build && npm start        # o: npm run start:dev
# variables opcionales: PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE, PORT
```

Antes de arrancar por primera vez, crear la base y cargar el esquema:

```bash
createdb alcanzandosuenos
psql alcanzandosuenos -f backend/schema.sql
```

### App

```bash
cd alcanzandosuenos
npm install
npx expo start --web     # para probar rápido en el navegador
npx expo start            # para Expo Go en un celular real
```

Para un dispositivo físico, apuntar la app al backend publicado:

```bash
EXPO_PUBLIC_API_URL=https://tu-backend.ejemplo.com npx expo start
```
