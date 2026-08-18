import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../db/db.module';
import { PasosService } from '../pasos/pasos.service';
import { LogrosService } from '../logros/logros.service';
import { CrearMetaDto } from './dto/crear-meta.dto';
import { ActualizarMetaDto } from './dto/actualizar-meta.dto';
import { CrearAporteDto } from './dto/crear-aporte.dto';

function progresoDe(actual: number, objetivo: number) {
  return objetivo > 0 ? Math.min(100, Math.round((actual / objetivo) * 100)) : 0;
}

@Injectable()
export class MetasService {
  constructor(
    @Inject(PG_POOL) private readonly pool: Pool,
    private readonly pasosService: PasosService,
    private readonly logrosService: LogrosService,
  ) {}

  // usuarioId viene siempre del token verificado (SupabaseAuthGuard), nunca
  // del body — así nadie puede crear una meta a nombre de otro usuario.
  async crear(dto: CrearMetaDto, usuarioId: string) {
    const { rows } = await this.pool.query(
      `insert into meta (usuario_id, categoria, titulo, monto_objetivo, monto_actual, fecha_objetivo, aporte_periodico)
       values ($1, $2, $3, $4, $5, $6, $7)
       returning *`,
      [
        usuarioId,
        dto.categoria,
        dto.titulo,
        dto.monto_objetivo,
        dto.monto_actual ?? 0,
        dto.fecha_objetivo,
        dto.aporte_periodico,
      ],
    );
    const meta = rows[0];
    // Backlog Sprint 2: la meta nace con su plan de acción por defecto según categoría.
    const pasos = await this.pasosService.crearDefaultParaMeta(meta.id, meta.categoria);
    return { ...meta, pasos };
  }

  // Tablero de metas (Backlog Sprint 2): lista + resumen + filtro por estado.
  async listarPorUsuario(usuarioId: string, estado?: string) {
    const params: any[] = [usuarioId];
    let filtro = '';
    if (estado && estado !== 'todas') {
      params.push(estado);
      filtro = `and estado = $${params.length}`;
    }
    const { rows } = await this.pool.query(
      `select * from meta where usuario_id = $1 ${filtro} order by creada_en desc`,
      params,
    );

    const { rows: todas } = await this.pool.query(
      `select estado, monto_actual, monto_objetivo from meta where usuario_id = $1`,
      [usuarioId],
    );
    const totalObjetivo = todas.reduce((acc, m) => acc + Number(m.monto_objetivo), 0);
    const totalActual = todas.reduce((acc, m) => acc + Number(m.monto_actual), 0);

    const resumen = {
      total: todas.length,
      activas: todas.filter((m) => m.estado === 'activa').length,
      completadas: todas.filter((m) => m.estado === 'completada').length,
      pausadas: todas.filter((m) => m.estado === 'pausada').length,
      progreso_general: totalObjetivo > 0 ? Math.round((totalActual / totalObjetivo) * 100) : 0,
    };

    return { resumen, metas: rows };
  }

  async buscarPorId(id: string, usuarioId: string) {
    const meta = await this.buscarExisteYDeUsuario(id, usuarioId);
    const pasos = await this.pasosService.listarPorMeta(id);
    const { rows: aportes } = await this.pool.query(
      `select id, monto, fecha, origen from aporte where meta_id = $1 order by fecha desc`,
      [id],
    );
    const progreso =
      Number(meta.monto_objetivo) > 0
        ? Math.min(100, Math.round((Number(meta.monto_actual) / Number(meta.monto_objetivo)) * 100))
        : 0;
    return { ...meta, progreso, pasos, aportes };
  }

  async actualizar(id: string, dto: ActualizarMetaDto, usuarioId: string) {
    await this.buscarExisteYDeUsuario(id, usuarioId);
    const { rows } = await this.pool.query(
      `update meta set
         titulo = coalesce($2, titulo),
         estado = coalesce($3, estado)
       where id = $1
       returning *`,
      [id, dto.titulo ?? null, dto.estado ?? null],
    );
    return rows[0];
  }

  // Registrar aporte (Backlog Sprint 3, se adelanta acá para que el detalle de
  // meta sea funcional de punta a punta): impacta monto_actual de inmediato y
  // completa la meta automáticamente si se alcanza el objetivo.
  async registrarAporte(metaId: string, dto: CrearAporteDto, usuarioId: string) {
    const meta = await this.buscarExisteYDeUsuario(metaId, usuarioId);
    const client = await this.pool.connect();
    try {
      await client.query('begin');
      const { rows: aporteRows } = await client.query(
        `insert into aporte (meta_id, monto, origen) values ($1, $2, $3) returning id, monto, fecha, origen`,
        [metaId, dto.monto, dto.origen ?? 'manual'],
      );
      const nuevoActual = Number(meta.monto_actual) + Number(dto.monto);
      const nuevoEstado = nuevoActual >= Number(meta.monto_objetivo) ? 'completada' : meta.estado;
      const { rows: metaRows } = await client.query(
        `update meta set monto_actual = $1, estado = $2 where id = $3 returning *`,
        [nuevoActual, nuevoEstado, metaId],
      );

      // Backlog Sprint 3: "recibir ... avisos cuando alcanzo un hito" — se
      // evalúa en la misma transacción que el aporte (ver Logros, sección Arquitectura).
      const progresoAnterior = progresoDe(Number(meta.monto_actual), Number(meta.monto_objetivo));
      const progresoNuevo = progresoDe(nuevoActual, Number(meta.monto_objetivo));
      const nuevosLogros = await this.logrosService.evaluarYRegistrar(client, {
        usuarioId: meta.usuario_id,
        metaId,
        progresoAnterior,
        progresoNuevo,
      });

      await client.query('commit');
      return { aporte: aporteRows[0], meta: metaRows[0], nuevosLogros };
    } catch (e) {
      await client.query('rollback');
      throw e;
    } finally {
      client.release();
    }
  }

  // Devuelve 404 tanto si la meta no existe como si es de otro usuario — no
  // hay que darle a un atacante la pista de "existe pero no es tuya".
  private async buscarExisteYDeUsuario(id: string, usuarioId: string) {
    const { rows } = await this.pool.query(`select * from meta where id = $1`, [id]);
    if (!rows[0] || rows[0].usuario_id !== usuarioId) throw new NotFoundException('Meta no encontrada');
    return rows[0];
  }
}
