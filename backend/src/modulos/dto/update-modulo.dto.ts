import { PartialType } from '@nestjs/swagger';
import { CreateModuloDto } from './create-modulo.dto';

// Todos os campos do CreateModuloDto tornam-se opcionais na atualização (PATCH)
export class UpdateModuloDto extends PartialType(CreateModuloDto) {}
