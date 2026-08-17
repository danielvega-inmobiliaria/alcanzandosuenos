import { IsIn, IsISO8601, IsNumber, IsOptional, IsPositive, IsString, IsUUID, MinLength } from 'class-validator';

const CATEGORIAS = ['auto', 'casa', 'viaje', 'estudios', 'computadora', 'personal', 'personalizada'];

export class CrearMetaDto {
  @IsUUID()
  usuario_id: string;

  @IsIn(CATEGORIAS)
  categoria: string;

  @IsString()
  @MinLength(2)
  titulo: string;

  @IsNumber()
  @IsPositive()
  monto_objetivo: number;

  @IsNumber()
  @IsOptional()
  monto_actual?: number;

  @IsISO8601()
  fecha_objetivo: string;

  @IsNumber()
  @IsPositive()
  aporte_periodico: number;
}
