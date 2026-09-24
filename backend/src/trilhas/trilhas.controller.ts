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
import { TrilhasService } from './trilhas.service';
import { CreateTrilhaDto } from './dto/create-trilha.dto';
import { UpdateTrilhaDto } from './dto/update-trilha.dto';

// Todas as rotas deste controller exigem o token JWT
@ApiTags('trilhas')
@ApiBearerAuth('token')
@UseGuards(AuthGuard('jwt'))
@ApiResponse({ status: 401, description: 'Token ausente ou inválido.' })
@Controller('trilhas')
export class TrilhasController {
  constructor(private readonly trilhasService: TrilhasService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar trilha' })
  @ApiResponse({ status: 201, description: 'Registro criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() createTrilhaDto: CreateTrilhaDto) {
    return this.trilhasService.create(createTrilhaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar registros de trilha' })
  findAll() {
    return this.trilhasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar trilha pelo ID' })
  @ApiResponse({ status: 404, description: 'Registro não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.trilhasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar trilha' })
  @ApiResponse({ status: 404, description: 'Registro não encontrado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTrilhaDto: UpdateTrilhaDto,
  ) {
    return this.trilhasService.update(id, updateTrilhaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover trilha' })
  @ApiResponse({ status: 404, description: 'Registro não encontrado.' })
  @ApiResponse({
    status: 409,
    description: 'Registro vinculado a outros dados.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.trilhasService.remove(id);
  }
}
