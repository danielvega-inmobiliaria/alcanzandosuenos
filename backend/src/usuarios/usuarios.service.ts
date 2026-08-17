import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../db/db.module';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async crear(dto: CrearUsuarioDto) {
    const { rows } = await this.pool.query(
      `insert into usuario (nombre, email) values ($1, $2)
       on conflict (email) do update set nombre = excluded.nombre
       returning id, nombre, email, fecha_alta`,
      [dto.nombre, dto.email],
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
