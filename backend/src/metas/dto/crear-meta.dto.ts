import { IsIn, IsISO8601, IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';

const CATEGORIAS = ['auto', 'casa', 'viaje', 'estudios', 'computadora', 'personal', 'personalizada'];

// `usuario_id` ya no viene del cliente (antes era el bloqueante de seguridad
// más obvio: cualquiera podía crear metas a nombre de otro usuario_id).
// El controller lo agrega server-side desde el token verificado.
export class CrearMetaDto {
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
