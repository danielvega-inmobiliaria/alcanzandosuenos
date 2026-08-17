import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class ActualizarMetaDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  titulo?: string;

  @IsIn(['activa', 'completada', 'pausada'])
  @IsOptional()
  estado?: string;
}
