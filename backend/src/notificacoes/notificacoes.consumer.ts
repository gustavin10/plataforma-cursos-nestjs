import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  KafkaService,
  TOPICOS,
  UsuarioCadastradoEvento,
} from '../kafka/kafka.service';
import { NotificacoesService } from './notificacoes.service';

// CONSUMIDOR Kafka: escuta "usuario-cadastrado" e gera a notificação de boas-vindas
@Injectable()
export class NotificacoesConsumer implements OnModuleInit {
  private readonly logger = new Logger('NotificacoesConsumer');

  constructor(
    private kafka: KafkaService,
    private notificacoesService: NotificacoesService,
  ) {}

  onModuleInit() {
    void this.iniciar();
  }

  private async iniciar() {
    try {
      await this.kafka.consumir<UsuarioCadastradoEvento>(
        'servico-notificacoes',
        TOPICOS.USUARIO_CADASTRADO,
        async (evento) => {
          this.logger.log(`Usuário cadastrado recebido: ${evento.email}`);
          await this.notificacoesService.criarBoasVindas(evento);
        },
      );
    } catch (erro) {
      this.logger.warn(
        `Kafka indisponível (${(erro as Error).message}). Nova tentativa em 5s.`,
      );
      setTimeout(() => void this.iniciar(), 5000);
    }
  }
}
