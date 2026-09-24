import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TrilhasCursosService } from './trilhas-cursos.service';
import { CreateTrilhaCursoDto } from './dto/create-trilha-curso.dto';
import { UpdateTrilhaCursoDto } from './dto/update-trilha-curso.dto';

// Todas as rotas deste controller exigem o token JWT
@ApiTags('trilhas-cursos')
@ApiBearerAuth('token')
@UseGuards(AuthGuard('jwt'))
@ApiResponse({ status: 401, description: 'Token ausente ou inválido.' })
@Controller('trilhas-cursos')
export class TrilhasCursosController {
  constructor(private readonly trilhasCursosService: TrilhasCursosService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar vínculo trilha x curso' })
  @ApiResponse({ status: 201, description: 'Registro criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() createTrilhaCursoDto: CreateTrilhaCursoDto) {
    return this.trilhasCursosService.create(createTrilhaCursoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar registros de vínculo trilha x curso' })
  findAll() {
    return this.trilhasCursosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar vínculo trilha x curso pelo ID' })
  @ApiResponse({ status: 404, description: 'Registro não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.trilhasCursosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar vínculo trilha x curso' })
  @ApiResponse({ status: 404, description: 'Registro não encontrado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTrilhaCursoDto: UpdateTrilhaCursoDto,
  ) {
    return this.trilhasCursosService.update(id, updateTrilhaCursoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover vínculo trilha x curso' })
  @ApiResponse({ status: 404, description: 'Registro não encontrado.' })
  @ApiResponse({
    status: 409,
    description: 'Registro vinculado a outros dados.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.trilhasCursosService.remove(id);
  }
}
