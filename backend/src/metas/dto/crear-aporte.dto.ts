import { IsIn, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CrearAporteDto {
  @IsNumber()
  @IsPositive()
  monto: number;

  @IsIn(['manual', 'recordatorio_cumplido'])
  @IsOptional()
  origen?: string;
}
