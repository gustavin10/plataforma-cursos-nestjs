import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AlunoService } from './aluno.service';
import { MatricularDto } from './dto/matricular.dto';

type RequisicaoAutenticada = { user: { userId: number } };

// Rotas da área do aluno, usadas pelo app mobile. O aluno é identificado pelo token JWT.
@ApiTags('aluno')
@ApiBearerAuth('token')
@UseGuards(AuthGuard('jwt'))
@ApiResponse({ status: 401, description: 'Token ausente ou inválido.' })
@Controller('aluno')
export class AlunoController {
  constructor(private readonly alunoService: AlunoService) {}

  @Get('trilhas')
  @ApiOperation({ summary: 'Trilhas com seus cursos em ordem' })
  trilhas() {
    return this.alunoService.trilhas();
  }

  @Get('cursos')
  @ApiOperation({ summary: 'Catálogo de cursos (com categoria e instrutor)' })
  cursos() {
    return this.alunoService.cursos();
  }

  @Get('cursos/:id')
  @ApiOperation({ summary: 'Curso com módulos, aulas e situação do aluno' })
  @ApiResponse({ status: 404, description: 'Curso não encontrado.' })
  curso(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: RequisicaoAutenticada,
  ) {
    return this.alunoService.curso(id, req.user.userId);
  }

  @Get('aulas/:id')
  @ApiOperation({ summary: 'Conteúdo da aula (somente matriculados)' })
  @ApiResponse({ status: 403, description: 'Aluno não matriculado no curso.' })
  aula(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: RequisicaoAutenticada,
  ) {
    return this.alunoService.aula(id, req.user.userId);
  }

  @Get('meus-cursos')
  @ApiOperation({ summary: 'Cursos em que o aluno logado está matriculado' })
  meusCursos(@Request() req: RequisicaoAutenticada) {
    return this.alunoService.meusCursos(req.user.userId);
  }

  @Post('matriculas')
  @ApiOperation({
    summary: 'Matricular no curso (e pagar o plano, se necessário)',
  })
  @ApiResponse({ status: 201, description: 'Matrícula realizada.' })
  @ApiResponse({ status: 409, description: 'Aluno já matriculado.' })
  matricular(
    @Body() dto: MatricularDto,
    @Request() req: RequisicaoAutenticada,
  ) {
    return this.alunoService.matricular(req.user.userId, dto);
  }
}
