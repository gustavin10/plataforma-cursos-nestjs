import { PartialType } from '@nestjs/swagger';
import { CreateTrilhaDto } from './create-trilha.dto';

// Todos os campos do CreateTrilhaDto tornam-se opcionais na atualização (PATCH)
export class UpdateTrilhaDto extends PartialType(CreateTrilhaDto) {}
