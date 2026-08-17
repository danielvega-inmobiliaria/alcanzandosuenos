import { Global, Module } from '@nestjs/common';
import { Pool } from 'pg';

export const PG_POOL = 'PG_POOL';

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
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
