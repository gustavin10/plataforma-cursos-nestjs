import 'dotenv/config';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Consumer, Kafka, logLevel } from 'kafkajs';

// Tópicos usados pela aplicação
export const TOPICOS = {
  USUARIO_CADASTRADO: 'usuario-cadastrado',
} as const;

// Conteúdo da mensagem publicada quando um usuário é cadastrado
export interface UsuarioCadastradoEvento {
  idUsuario: number;
  nomeCompleto: string;
  email: string;
  dataCadastro: Date;
}

// Centraliza a conexão com o Kafka: o PRODUTOR fica aqui e os consumidores são criados por quem precisar.
// Se o Kafka estiver fora do ar, a API continua funcionando e tenta reconectar.
@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('Kafka');
  private readonly kafka = new Kafka({
    clientId: 'plataforma-cursos-api',
    brokers: [process.env.KAFKA_BROKER ?? 'localhost:9092'],
    logLevel: logLevel.NOTHING,
    retry: { retries: 3 },
  });
  private readonly producer = this.kafka.producer();
  private conectado = false;

  onModuleInit() {
    void this.conectar();
  }

  async onModuleDestroy() {
    await this.producer.disconnect().catch(() => null);
  }

  private async conectar() {
    try {
      await this.criarTopicos();
      await this.producer.connect();
      this.conectado = true;
      this.logger.log('Produtor conectado ao Kafka');
    } catch (erro) {
      this.logger.warn(
        `Kafka indisponível (${(erro as Error).message}). Nova tentativa em 5s.`,
      );
      setTimeout(() => void this.conectar(), 5000);
    }
  }

  private async criarTopicos() {
    const admin = this.kafka.admin();
    await admin.connect();
    await admin.createTopics({
      topics: Object.values(TOPICOS).map((topic) => ({
        topic,
        numPartitions: 1,
        replicationFactor: 1,
      })),
    });
    await admin.disconnect();
  }

  // Publica uma mensagem (JSON) em um tópico
  async publicar(topico: string, chave: string, mensagem: object) {
    if (!this.conectado) {
      this.logger.warn(
        `Kafka desconectado: mensagem para "${topico}" descartada`,
      );
      return;
    }
    try {
      await this.producer.send({
        topic: topico,
        messages: [{ key: chave, value: JSON.stringify(mensagem) }],
      });
      this.logger.log(`Mensagem publicada em "${topico}" (chave ${chave})`);
    } catch (erro) {
      this.logger.error(
        `Falha ao publicar em "${topico}": ${(erro as Error).message}`,
      );
    }
  }

  // Cria um consumidor em um grupo e executa "aoReceber" para cada mensagem do tópico
  async consumir<T>(
    grupo: string,
    topico: string,
    aoReceber: (mensagem: T) => Promise<void>,
  ): Promise<Consumer> {
    const consumer = this.kafka.consumer({ groupId: grupo });
    await consumer.connect();
    await consumer.subscribe({ topic: topico, fromBeginning: false });
    await consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;
        await aoReceber(JSON.parse(message.value.toString()) as T);
      },
    });
    this.logger.log(`Consumidor "${grupo}" escutando "${topico}"`);
    return consumer;
  }
}
