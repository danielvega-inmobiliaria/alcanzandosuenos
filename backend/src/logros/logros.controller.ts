import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { LogrosService } from './logros.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

// Antes era /usuarios/:usuarioId/logros confiando en el param de la URL —
// se simplifica a "los logros del usuario autenticado", sin forma de pedir
// los de otro usuario.
@Controller('logros')
@UseGuards(SupabaseAuthGuard)
export class LogrosController {
  constructor(private readonly service: LogrosService) {}

  @Get()
  listar(@Req() req: any) {
    return this.service.listarPorUsuario(req.usuarioId);
  }
}
