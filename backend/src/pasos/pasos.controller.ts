import { Controller, Param, Patch } from '@nestjs/common';
import { PasosService } from './pasos.service';

@Controller('pasos')
export class PasosController {
  constructor(private readonly service: PasosService) {}

  // Tildar/destildar un paso del plan de acción (Backlog Sprint 2).
  @Patch(':id/alternar')
  alternar(@Param('id') id: string) {
    return this.service.alternar(id);
  }
}
