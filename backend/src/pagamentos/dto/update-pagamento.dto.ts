import { PartialType } from '@nestjs/swagger';
import { CreatePagamentoDto } from './create-pagamento.dto';

// Todos os campos do CreatePagamentoDto tornam-se opcionais na atualização (PATCH)
export class UpdatePagamentoDto extends PartialType(CreatePagamentoDto) {}
