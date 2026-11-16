import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificacoesController } from './notificacoes.controller';
import { NotificacoesService } from './notificacoes.service';
import { NotificacoesConsumer } from './notificacoes.consumer';

@Module({
  imports: [PrismaModule],
  controllers: [NotificacoesController],
  providers: [NotificacoesService, NotificacoesConsumer],
})
export class NotificacoesModule {}
