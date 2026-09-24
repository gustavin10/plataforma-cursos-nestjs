// Popula o banco com os dados iniciais (os mesmos do antigo db.json do JSON Server).
// Executar com: npx prisma db seed
import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import dados from './dados-iniciais.json';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

// Senha padrão de todos os usuários de exemplo
const SENHA_PADRAO = '123456';

// Converte "2025-03-10" em Date (ou mantém null)
const data = (valor: string | null) => (valor ? new Date(valor) : null);

async function main() {
  // Limpa as tabelas (ordem inversa das dependências)
  await prisma.pagamento.deleteMany();
  await prisma.assinatura.deleteMany();
  await prisma.plano.deleteMany();
  await prisma.certificado.deleteMany();
  await prisma.avaliacao.deleteMany();
  await prisma.progressoAula.deleteMany();
  await prisma.matricula.deleteMany();
  await prisma.trilhaCurso.deleteMany();
  await prisma.trilha.deleteMany();
  await prisma.aula.deleteMany();
  await prisma.modulo.deleteMany();
  await prisma.curso.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.usuario.deleteMany();

  const hash = await bcrypt.hash(SENHA_PADRAO, await bcrypt.genSalt());

  await prisma.usuario.createMany({
    data: dados.usuarios.map(
      ({ senhaHash: _senhaHash, dataCadastro, ...u }) => ({
        ...u,
        senha: hash,
        dataCadastro: data(dataCadastro)!,
      }),
    ),
  });
  await prisma.categoria.createMany({ data: dados.categorias });
  await prisma.curso.createMany({
    data: dados.cursos.map((c) => ({
      ...c,
      dataPublicacao: data(c.dataPublicacao)!,
    })),
  });
  await prisma.modulo.createMany({ data: dados.modulos });
  await prisma.aula.createMany({ data: dados.aulas });
  await prisma.trilha.createMany({ data: dados.trilhas });
  await prisma.trilhaCurso.createMany({ data: dados.trilhasCursos });
  await prisma.matricula.createMany({
    data: dados.matriculas.map((m) => ({
      ...m,
      dataMatricula: data(m.dataMatricula)!,
      dataConclusao: data(m.dataConclusao),
    })),
  });
  await prisma.progressoAula.createMany({
    data: dados.progressoAulas.map((p) => ({
      ...p,
      dataConclusao: data(p.dataConclusao),
    })),
  });
  await prisma.avaliacao.createMany({
    data: dados.avaliacoes.map((a) => ({
      ...a,
      dataAvaliacao: data(a.dataAvaliacao)!,
    })),
  });
  await prisma.certificado.createMany({
    data: dados.certificados.map((c) => ({
      ...c,
      dataEmissao: data(c.dataEmissao)!,
    })),
  });
  await prisma.plano.createMany({ data: dados.planos });
  await prisma.assinatura.createMany({
    data: dados.assinaturas.map((a) => ({
      ...a,
      dataInicio: data(a.dataInicio)!,
      dataFim: data(a.dataFim)!,
    })),
  });
  await prisma.pagamento.createMany({
    data: dados.pagamentos.map((p) => ({
      ...p,
      dataPagamento: data(p.dataPagamento)!,
    })),
  });

  // Como os IDs foram inseridos manualmente, ajusta as sequências do autoincrement
  const tabelas = [
    'usuarios',
    'categorias',
    'cursos',
    'modulos',
    'aulas',
    'trilhas',
    'trilhas_cursos',
    'matriculas',
    'progresso_aulas',
    'avaliacoes',
    'certificados',
    'planos',
    'assinaturas',
    'pagamentos',
  ];
  for (const tabela of tabelas) {
    await prisma.$executeRawUnsafe(
      `SELECT setval(pg_get_serial_sequence('"${tabela}"', 'id'), COALESCE((SELECT MAX(id) FROM "${tabela}"), 0) + 1, false)`,
    );
  }

  console.log(
    `Seed concluído! Login de exemplo: ana.souza@email.com / ${SENHA_PADRAO}`,
  );
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
