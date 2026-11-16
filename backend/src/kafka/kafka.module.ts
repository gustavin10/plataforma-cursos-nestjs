import { Global, Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';

// Global: qualquer módulo pode injetar o KafkaService sem importar este módulo
@Global()
@Module({
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
