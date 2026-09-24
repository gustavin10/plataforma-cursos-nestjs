import { PartialType } from '@nestjs/swagger';
import { CreatePlanoDto } from './create-plano.dto';

// Todos os campos do CreatePlanoDto tornam-se opcionais na atualização (PATCH)
export class UpdatePlanoDto extends PartialType(CreatePlanoDto) {}
