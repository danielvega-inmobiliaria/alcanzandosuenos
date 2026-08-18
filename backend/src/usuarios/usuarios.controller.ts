import { Controller, ForbiddenException, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Controller('usuarios')
@UseGuards(SupabaseAuthGuard)
export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}

  // Se llama una vez apenas el usuario se loguea (ver AuthContext del front).
  // No recibe nombre/email por body: los toma del token ya verificado, así
  // nadie puede crearse un usuario con el email de otra persona.
  @Post('sync')
  sync(@Req() req: any) {
    return this.service.asegurarUsuario(req.usuarioId, req.usuarioEmail);
  }

  @Get(':id')
  buscar(@Req() req: any, @Param('id') id: string) {
    // Por ahora cada usuario solo puede ver su propio perfil.
    if (id !== req.usuarioId) throw new ForbiddenException();
    return this.service.buscarPorId(id);
  }
}
