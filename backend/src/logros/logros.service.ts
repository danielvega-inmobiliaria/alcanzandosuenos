import { Inject, Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { PG_POOL } from '../db/db.module';

// Cortes de progreso que otorgan un logro (Arquitectura Técnica, tabla `logro`;
// Backlog Sprint 3: "recibir ... avisos cuando alcanzo un hito"). La racha de
// 30 días queda fuera de alcance acá: requiere un job programado que mida
// actividad diaria, no un cálculo síncrono al registrar un aporte.
const CORTES: Array<{ desde: number; tipo: string }> = [
  { desde: 100, tipo: 'meta_cumplida' },
  { desde: 90, tipo: 'noventa_por_ciento' },
  { desde: 50, tipo: 'cincuenta_por_ciento' },
  { desde: 10, tipo: 'diez_por_ciento' },
];

@Injectable()
export class LogrosService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  // Se llama dentro de la misma transacción que registra el aporte, para que
  // el logro y el aporte queden consistentes entre sí.
  async evaluarYRegistrar(
    client: PoolClient,
    params: { usuarioId: string; metaId: string; progresoAnterior: number; progresoNuevo: number },
  ) {
    const { usuarioId, metaId, progresoAnterior, progresoNuevo } = params;
    const nuevosLogros: any[] = [];

    const tiposACrear: string[] = [];

    const { rows: aportesPrevios } = await client.query(
      `select count(*)::int as n from aporte a join meta m on m.id = a.meta_id where m.usuario_id = $1`,
      [usuarioId],
    );
    if (aportesPrevios[0].n === 1) tiposACrear.push('primer_aporte'); // este mismo aporte ya está insertado

    for (const corte of CORTES) {
      if (progresoAnterior < corte.desde && progresoNuevo >= corte.desde) {
        tiposACrear.push(corte.tipo);
      }
    }

    for (const tipo of tiposACrear) {
      const scopeMetaId = tipo === 'primer_aporte' ? null : metaId;
      const { rows: existe } = await client.query(
        `select id from logro where usuario_id = $1 and tipo = $2 and meta_id is not distinct from $3`,
        [usuarioId, tipo, scopeMetaId],
      );
      if (existe[0]) continue;
      const { rows } = await client.query(
        `insert into logro (usuario_id, meta_id, tipo) values ($1, $2, $3) returning id, usuario_id, meta_id, tipo, obtenido_en`,
        [usuarioId, scopeMetaId, tipo],
      );
      nuevosLogros.push(rows[0]);
    }

    return nuevosLogros;
  }

  async listarPorUsuario(usuarioId: string) {
    const { rows } = await this.pool.query(
      `select id, meta_id, tipo, obtenido_en from logro where usuario_id = $1 order by obtenido_en desc`,
      [usuarioId],
    );
    return rows;
  }
}
