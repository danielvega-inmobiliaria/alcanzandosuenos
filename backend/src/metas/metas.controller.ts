import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { MetasService } from './metas.service';
import { CrearMetaDto } from './dto/crear-meta.dto';
import { ActualizarMetaDto } from './dto/actualizar-meta.dto';
import { CrearAporteDto } from './dto/crear-aporte.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Controller('metas')
@UseGuards(SupabaseAuthGuard)
export class MetasController {
  constructor(private readonly service: MetasService) {}

  @Post()
  crear(@Req() req: any, @Body() dto: CrearMetaDto) {
    return this.service.crear(dto, req.usuarioId);
  }

  // GET /metas?estado=activa|completada|pausada|todas — siempre las metas
  // del usuario autenticado, ya no se acepta un usuario_id por query.
  @Get()
  listar(@Req() req: any, @Query('estado') estado?: string) {
    return this.service.listarPorUsuario(req.usuarioId, estado);
  }

  @Get(':id')
  buscar(@Req() req: any, @Param('id') id: string) {
    return this.service.buscarPorId(id, req.usuarioId);
  }

  @Patch(':id')
  actualizar(@Req() req: any, @Param('id') id: string, @Body() dto: ActualizarMetaDto) {
    return this.service.actualizar(id, dto, req.usuarioId);
  }

  @Post(':id/aportes')
  registrarAporte(@Req() req: any, @Param('id') id: string, @Body() dto: CrearAporteDto) {
    return this.service.registrarAporte(id, dto, req.usuarioId);
  }
}
