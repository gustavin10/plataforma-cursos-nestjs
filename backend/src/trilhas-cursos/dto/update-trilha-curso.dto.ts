import { PartialType } from '@nestjs/swagger';
import { CreateTrilhaCursoDto } from './create-trilha-curso.dto';

// Todos os campos do CreateTrilhaCursoDto tornam-se opcionais na atualização (PATCH)
export class UpdateTrilhaCursoDto extends PartialType(CreateTrilhaCursoDto) {}
