import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsuarioCadastradoEvento } from '../kafka/kafka.service';

@Injectable()
export class NotificacoesService {
  private readonly logger = new Logger('NotificacoesService');

  constructor(private prisma: PrismaService) {}

  async criarBoasVindas(evento: UsuarioCadastradoEvento) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: evento.idUsuario },
    });
    if (!usuario) return; // usuário removido antes da mensagem ser processada

    const primeiroNome = evento.nomeCompleto.split(' ')[0];
    const notificacao = await this.prisma.notificacao.create({
      data: {
        idUsuario: evento.idUsuario,
        titulo: `Bem-vindo(a), ${primeiroNome}! 🎉`,
        mensagem:
          'Sua conta na Gustavo Milhomem Cursos foi criada. Explore as trilhas e matricule-se no seu primeiro curso!',
      },
    });
    this.logger.log(`Notificação de boas-vindas #${notificacao.id} criada`);
    return notificacao;
  }

  // Notificações do usuário logado, mais recentes primeiro
  doUsuario(idUsuario: number) {
    return this.prisma.notificacao.findMany({
      where: { idUsuario },
      orderBy: { criadaEm: 'desc' },
    });
  }

  async marcarComoLida(id: number, idUsuario: number) {
    const notificacao = await this.prisma.notificacao.findFirst({
      where: { id, idUsuario },
    });
    if (!notificacao)
      throw new NotFoundException(`Notificação #${id} não encontrada.`);
    return this.prisma.notificacao.update({
      where: { id },
      data: { lida: true },
    });
  }
}
