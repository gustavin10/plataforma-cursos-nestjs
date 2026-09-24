import { PartialType } from '@nestjs/swagger';
import { CreateAulaDto } from './create-aula.dto';

// Todos os campos do CreateAulaDto tornam-se opcionais na atualização (PATCH)
export class UpdateAulaDto extends PartialType(CreateAulaDto) {}
