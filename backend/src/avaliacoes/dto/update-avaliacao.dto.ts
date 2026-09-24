import { PartialType } from '@nestjs/swagger';
import { CreateAvaliacaoDto } from './create-avaliacao.dto';

// Todos os campos do CreateAvaliacaoDto tornam-se opcionais na atualização (PATCH)
export class UpdateAvaliacaoDto extends PartialType(CreateAvaliacaoDto) {}
