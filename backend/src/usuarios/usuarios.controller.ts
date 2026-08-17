import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}

  @Post()
  crear(@Body() dto: CrearUsuarioDto) {
    return this.service.crear(dto);
  }

  @Get(':id')
  buscar(@Param('id') id: string) {
    return this.service.buscarPorId(id);
  }
}
