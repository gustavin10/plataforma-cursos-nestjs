import { PartialType } from '@nestjs/swagger';
import { CreateProgressoAulaDto } from './create-progresso-aula.dto';

// Todos os campos do CreateProgressoAulaDto tornam-se opcionais na atualização (PATCH)
export class UpdateProgressoAulaDto extends PartialType(
  CreateProgressoAulaDto,
) {}
