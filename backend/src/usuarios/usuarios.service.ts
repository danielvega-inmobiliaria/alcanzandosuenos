import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../db/db.module';

@Injectable()
export class UsuariosService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  // Se llama con el id/email ya verificados por SupabaseAuthGuard (nunca con
  // datos que mande el cliente sin validar). El id de `usuario` es el mismo
  // uuid que Supabase Auth le asignó al usuario — así no hace falta una
  // columna de mapeo aparte entre "usuario de auth" y "usuario de la app".
  async asegurarUsuario(id: string, email: string, nombre?: string) {
    const { rows } = await this.pool.query(
      `insert into usuario (id, nombre, email) values ($1, $2, $3)
       on conflict (id) do update set email = excluded.email
       returning id, nombre, email, fecha_alta`,
      [id, nombre || email.split('@')[0], email],
    );
    return rows[0];
  }

  async buscarPorId(id: string) {
    const { rows } = await this.pool.query(
      `select id, nombre, email, fecha_alta from usuario where id = $1`,
      [id],
    );
    if (!rows[0]) throw new NotFoundException('Usuario no encontrado');
    return rows[0];
  }
}
