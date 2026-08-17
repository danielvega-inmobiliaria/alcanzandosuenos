import { Module } from '@nestjs/common';
import { PasosController } from './pasos.controller';
import { PasosService } from './pasos.service';

@Module({
  controllers: [PasosController],
  providers: [PasosService],
  exports: [PasosService],
})
export class PasosModule {}
