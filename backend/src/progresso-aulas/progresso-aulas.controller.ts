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
import { ProgressoAulasService } from './progresso-aulas.service';
import { CreateProgressoAulaDto } from './dto/create-progresso-aula.dto';
import { UpdateProgressoAulaDto } from './dto/update-progresso-aula.dto';

// Todas as rotas deste controller exigem o token JWT
@ApiTags('progresso-aulas')
@ApiBearerAuth('token')
@UseGuards(AuthGuard('jwt'))
@ApiResponse({ status: 401, description: 'Token ausente ou inválido.' })
@Controller('progresso-aulas')
export class ProgressoAulasController {
  constructor(private readonly progressoAulasService: ProgressoAulasService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar progresso de aula' })
  @ApiResponse({ status: 201, description: 'Registro criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() createProgressoAulaDto: CreateProgressoAulaDto) {
    return this.progressoAulasService.create(createProgressoAulaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar registros de progresso de aula' })
  findAll() {
    return this.progressoAulasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar progresso de aula pelo ID' })
  @ApiResponse({ status: 404, description: 'Registro não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.progressoAulasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar progresso de aula' })
  @ApiResponse({ status: 404, description: 'Registro não encontrado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProgressoAulaDto: UpdateProgressoAulaDto,
  ) {
    return this.progressoAulasService.update(id, updateProgressoAulaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover progresso de aula' })
  @ApiResponse({ status: 404, description: 'Registro não encontrado.' })
  @ApiResponse({
    status: 409,
    description: 'Registro vinculado a outros dados.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.progressoAulasService.remove(id);
  }
}
