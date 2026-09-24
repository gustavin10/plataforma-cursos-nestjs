import { PartialType } from '@nestjs/swagger';
import { CreateCategoriaDto } from './create-categoria.dto';

// Todos os campos do CreateCategoriaDto tornam-se opcionais na atualização (PATCH)
export class UpdateCategoriaDto extends PartialType(CreateCategoriaDto) {}
