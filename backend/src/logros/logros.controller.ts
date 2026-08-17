import { Controller, Get, Param } from '@nestjs/common';
import { LogrosService } from './logros.service';

@Controller('usuarios/:usuarioId/logros')
export class LogrosController {
  constructor(private readonly service: LogrosService) {}

  @Get()
  listar(@Param('usuarioId') usuarioId: string) {
    return this.service.listarPorUsuario(usuarioId);
  }
}
