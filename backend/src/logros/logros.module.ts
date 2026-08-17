import { Module } from '@nestjs/common';
import { LogrosController } from './logros.controller';
import { LogrosService } from './logros.service';

@Module({
  controllers: [LogrosController],
  providers: [LogrosService],
  exports: [LogrosService],
})
export class LogrosModule {}
