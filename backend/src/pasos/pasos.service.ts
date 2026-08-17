import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../db/db.module';
import { pasosDefaultPara } from './pasos-default';

@Injectable()
export class PasosService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  // Crea el plan de acción por defecto al crear una meta (Backlog Sprint 2).
  async crearDefaultParaMeta(metaId: string, categoria: string) {
    const descripciones = pasosDefaultPara(categoria);
    const { rows } = await this.pool.query(
      `insert into paso (meta_id, descripcion, orden)
       select $1, d, o - 1
       from unnest($2::text[]) with ordinality as t(d, o)
       returning id, descripcion, estado, orden`,
      [metaId, descripciones],
    );
    return rows;
  }

  async listarPorMeta(metaId: string) {
    const { rows } = await this.pool.query(
      `select id, meta_id, descripcion, estado, orden, fecha_completado
       from paso where meta_id = $1 order by orden asc`,
      [metaId],
    );
    return rows;
  }

  async alternar(id: string) {
    const { rows: actual } = await this.pool.query(`select estado from paso where id = $1`, [id]);
    if (!actual[0]) throw new NotFoundException('Paso no encontrado');
    const nuevoEstado = actual[0].estado === 'completado' ? 'pendiente' : 'completado';
    const nuevaFecha = nuevoEstado === 'completado' ? new Date() : null;
    const { rows } = await this.pool.query(
      `update paso set estado = $1::paso_estado, fecha_completado = $2
       where id = $3
       returning id, meta_id, descripcion, estado, orden, fecha_completado`,
      [nuevoEstado, nuevaFecha, id],
    );
    return rows[0];
  }
}
