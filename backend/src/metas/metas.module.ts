import { Module } from '@nestjs/common';
import { MetasController } from './metas.controller';
import { MetasService } from './metas.service';
import { PasosModule } from '../pasos/pasos.module';
import { LogrosModule } from '../logros/logros.module';

@Module({
  imports: [PasosModule, LogrosModule],
  controllers: [MetasController],
  providers: [MetasService],
})
export class MetasModule {}
