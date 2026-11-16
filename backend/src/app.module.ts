import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { CategoriasModule } from './categorias/categorias.module';
import { CursosModule } from './cursos/cursos.module';
import { ModulosModule } from './modulos/modulos.module';
import { AulasModule } from './aulas/aulas.module';
import { TrilhasModule } from './trilhas/trilhas.module';
import { TrilhasCursosModule } from './trilhas-cursos/trilhas-cursos.module';
import { MatriculasModule } from './matriculas/matriculas.module';
import { ProgressoAulasModule } from './progresso-aulas/progresso-aulas.module';
import { AvaliacoesModule } from './avaliacoes/avaliacoes.module';
import { CertificadosModule } from './certificados/certificados.module';
import { PlanosModule } from './planos/planos.module';
import { AssinaturasModule } from './assinaturas/assinaturas.module';
import { PagamentosModule } from './pagamentos/pagamentos.module';
import { KafkaModule } from './kafka/kafka.module';
import { NotificacoesModule } from './notificacoes/notificacoes.module';
import { AlunoModule } from './aluno/aluno.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    // Usuário e Progresso
    UsuariosModule,
    MatriculasModule,
    ProgressoAulasModule,
    AvaliacoesModule,
    CertificadosModule,
    // Acadêmico e Conteúdo
    CategoriasModule,
    CursosModule,
    ModulosModule,
    AulasModule,
    TrilhasModule,
    TrilhasCursosModule,
    // Financeiro
    PlanosModule,
    AssinaturasModule,
    PagamentosModule,
    // Mensageria e área do aluno (app mobile)
    KafkaModule,
    NotificacoesModule,
    AlunoModule,
  ],
})
export class AppModule {}
