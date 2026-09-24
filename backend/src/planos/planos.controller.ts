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
import { PlanosService } from './planos.service';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';

// Todas as rotas deste controller exigem o token JWT
@ApiTags('planos')
@ApiBearerAuth('token')
@UseGuards(AuthGuard('jwt'))
@ApiResponse({ status: 401, description: 'Token ausente ou inválido.' })
@Controller('planos')
export class PlanosController {
  constructor(private readonly planosService: PlanosService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar plano' })
  @ApiResponse({ status: 201, description: 'Registro criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() createPlanoDto: CreatePlanoDto) {
    return this.planosService.create(createPlanoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar registros de plano' })
  findAll() {
    return this.planosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar plano pelo ID' })
  @ApiResponse({ status: 404, description: 'Registro não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.planosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar plano' })
  @ApiResponse({ status: 404, description: 'Registro não encontrado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlanoDto: UpdatePlanoDto,
  ) {
    return this.planosService.update(id, updatePlanoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover plano' })
  @ApiResponse({ status: 404, description: 'Registro não encontrado.' })
  @ApiResponse({
    status: 409,
    description: 'Registro vinculado a outros dados.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.planosService.remove(id);
  }
}
