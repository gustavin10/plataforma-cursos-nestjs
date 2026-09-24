import { PartialType } from '@nestjs/swagger';
import { CreateAssinaturaDto } from './create-assinatura.dto';

// Todos os campos do CreateAssinaturaDto tornam-se opcionais na atualização (PATCH)
export class UpdateAssinaturaDto extends PartialType(CreateAssinaturaDto) {}
