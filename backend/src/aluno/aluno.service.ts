import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MatricularDto } from './dto/matricular.dto';

// Dados extras que acompanham o curso nas telas do app
const INCLUIR_CURSO = {
  categoria: { select: { nome: true } },
  instrutor: { select: { nomeCompleto: true } },
} as const;

type CursoComRelacoes = {
  categoria: { nome: string };
  instrutor: { nomeCompleto: string };
  [campo: string]: unknown;
};

// Troca os objetos de categoria/instrutor pelos nomes (mais simples para o app)
function resumirCurso<T extends CursoComRelacoes>({
  categoria,
  instrutor,
  ...curso
}: T) {
  return {
    ...curso,
    categoria: categoria.nome,
    instrutor: instrutor.nomeCompleto,
  };
}

// Data de hoje (fuso local) no formato que o Prisma grava em colunas @db.Date
function hoje() {
  return new Date(new Date().toLocaleDateString('sv-SE'));
}

function somarMeses(data: Date, meses: number) {
  const resultado = new Date(data);
  resultado.setUTCMonth(resultado.getUTCMonth() + meses);
  return resultado;
}

@Injectable()
export class AlunoService {
  constructor(private prisma: PrismaService) {}

  async trilhas() {
    const trilhas = await this.prisma.trilha.findMany({
      orderBy: { id: 'asc' },
      include: {
        categoria: { select: { nome: true } },
        cursos: {
          orderBy: { ordem: 'asc' },
          include: { curso: { include: INCLUIR_CURSO } },
        },
      },
    });
    return trilhas.map(({ cursos, categoria, ...trilha }) => ({
      ...trilha,
      categoria: categoria.nome,
      cursos: cursos.map((tc) => resumirCurso(tc.curso)),
    }));
  }

  async cursos() {
    const cursos = await this.prisma.curso.findMany({
      orderBy: { id: 'asc' },
      include: INCLUIR_CURSO,
    });
    return cursos.map(resumirCurso);
  }

  // Curso com módulos e aulas, e a situação do aluno (matriculado? tem assinatura?)
  async curso(id: number, idUsuario: number) {
    const curso = await this.prisma.curso.findUnique({
      where: { id },
      include: {
        ...INCLUIR_CURSO,
        modulos: {
          orderBy: { ordem: 'asc' },
          include: { aulas: { orderBy: { ordem: 'asc' } } },
        },
      },
    });
    if (!curso) throw new NotFoundException(`Curso #${id} não encontrado.`);

    return {
      ...resumirCurso(curso),
      matriculado: await this.estaMatriculado(idUsuario, id),
      assinatura: await this.assinaturaAtiva(idUsuario),
    };
  }

  // Aula: só abre para quem está matriculado no curso
  async aula(id: number, idUsuario: number) {
    const aula = await this.prisma.aula.findUnique({
      where: { id },
      include: { modulo: { select: { titulo: true, idCurso: true } } },
    });
    if (!aula) throw new NotFoundException(`Aula #${id} não encontrada.`);
    if (!(await this.estaMatriculado(idUsuario, aula.modulo.idCurso))) {
      throw new ForbiddenException(
        'Matricule-se no curso para assistir à aula.',
      );
    }
    return aula;
  }

  async meusCursos(idUsuario: number) {
    const matriculas = await this.prisma.matricula.findMany({
      where: { idUsuario },
      orderBy: { dataMatricula: 'desc' },
      include: { curso: { include: INCLUIR_CURSO } },
    });
    return matriculas.map((m) => ({
      ...resumirCurso(m.curso),
      dataMatricula: m.dataMatricula,
      dataConclusao: m.dataConclusao,
    }));
  }

  // Matrícula + pagamento.
  // Com assinatura ativa, só matricula. Sem assinatura, faz o checkout do plano escolhido
  // (Assinatura + Pagamento, igual à tela de Checkout do site) e depois matricula.
  async matricular(idUsuario: number, dto: MatricularDto) {
    const curso = await this.prisma.curso.findUnique({
      where: { id: dto.idCurso },
    });
    if (!curso)
      throw new NotFoundException(`Curso #${dto.idCurso} não encontrado.`);
    if (await this.estaMatriculado(idUsuario, dto.idCurso)) {
      throw new ConflictException('Você já está matriculado neste curso.');
    }

    const assinaturaAtual = await this.assinaturaAtiva(idUsuario);

    return this.prisma.$transaction(async (tx) => {
      let pagamento: Awaited<ReturnType<typeof tx.pagamento.create>> | null =
        null;

      if (!assinaturaAtual) {
        if (!dto.idPlano || !dto.metodoPagamento) {
          throw new BadRequestException(
            'Escolha um plano e a forma de pagamento.',
          );
        }
        const plano = await tx.plano.findUnique({ where: { id: dto.idPlano } });
        if (!plano)
          throw new NotFoundException(`Plano #${dto.idPlano} não encontrado.`);

        const inicio = hoje();
        const assinatura = await tx.assinatura.create({
          data: {
            idUsuario,
            idPlano: plano.id,
            dataInicio: inicio,
            dataFim: somarMeses(inicio, plano.duracaoMeses),
          },
        });
        // Pagamento simulado: sempre aprovado
        pagamento = await tx.pagamento.create({
          data: {
            idAssinatura: assinatura.id,
            valorPago: plano.preco,
            dataPagamento: inicio,
            metodoPagamento: dto.metodoPagamento,
            idTransacaoGateway: `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
          },
        });
      }

      const matricula = await tx.matricula.create({
        data: { idUsuario, idCurso: dto.idCurso, dataMatricula: hoje() },
      });
      return { matricula, pagamento };
    });
  }

  private async estaMatriculado(idUsuario: number, idCurso: number) {
    const total = await this.prisma.matricula.count({
      where: { idUsuario, idCurso },
    });
    return total > 0;
  }

  // Assinatura vigente (dataFim a partir de hoje), com o nome do plano
  private async assinaturaAtiva(idUsuario: number) {
    const assinatura = await this.prisma.assinatura.findFirst({
      where: { idUsuario, dataFim: { gte: hoje() } },
      orderBy: { dataFim: 'desc' },
      include: { plano: { select: { nome: true } } },
    });
    if (!assinatura) return null;
    const { plano, ...dados } = assinatura;
    return { ...dados, plano: plano.nome };
  }
}
