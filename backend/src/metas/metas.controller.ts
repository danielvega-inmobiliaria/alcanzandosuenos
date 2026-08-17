import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { MetasService } from './metas.service';
import { CrearMetaDto } from './dto/crear-meta.dto';
import { ActualizarMetaDto } from './dto/actualizar-meta.dto';
import { CrearAporteDto } from './dto/crear-aporte.dto';

@Controller('metas')
export class MetasController {
  constructor(private readonly service: MetasService) {}

  @Post()
  crear(@Body() dto: CrearMetaDto) {
    return this.service.crear(dto);
  }

  // GET /metas?usuario_id=...&estado=activa|completada|pausada|todas
  @Get()
  listar(@Query('usuario_id') usuarioId: string, @Query('estado') estado?: string) {
    return this.service.listarPorUsuario(usuarioId, estado);
  }

  @Get(':id')
  buscar(@Param('id') id: string) {
    return this.service.buscarPorId(id);
  }

  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() dto: ActualizarMetaDto) {
    return this.service.actualizar(id, dto);
  }

  @Post(':id/aportes')
  registrarAporte(@Param('id') id: string, @Body() dto: CrearAporteDto) {
    return this.service.registrarAporte(id, dto);
  }
}
