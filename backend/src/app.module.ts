import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { MetasModule } from './metas/metas.module';
import { PasosModule } from './pasos/pasos.module';
import { LogrosModule } from './logros/logros.module';

@Module({
  imports: [DbModule, UsuariosModule, MetasModule, PasosModule, LogrosModule],
})
export class AppModule {}
