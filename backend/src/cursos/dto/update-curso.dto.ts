import { PartialType } from '@nestjs/swagger';
import { CreateCursoDto } from './create-curso.dto';

// Todos os campos do CreateCursoDto tornam-se opcionais na atualização (PATCH)
export class UpdateCursoDto extends PartialType(CreateCursoDto) {}
