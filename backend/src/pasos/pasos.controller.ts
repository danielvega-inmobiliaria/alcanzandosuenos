import { Controller, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { PasosService } from './pasos.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Controller('pasos')
@UseGuards(SupabaseAuthGuard)
export class PasosController {
  constructor(private readonly service: PasosService) {}

  // Tildar/destildar un paso del plan de acción (Backlog Sprint 2).
  @Patch(':id/alternar')
  alternar(@Req() req: any, @Param('id') id: string) {
    return this.service.alternar(id, req.usuarioId);
  }
}
