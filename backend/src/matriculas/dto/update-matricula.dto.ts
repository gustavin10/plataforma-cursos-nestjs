import { PartialType } from '@nestjs/swagger';
import { CreateMatriculaDto } from './create-matricula.dto';

// Todos os campos do CreateMatriculaDto tornam-se opcionais na atualização (PATCH)
export class UpdateMatriculaDto extends PartialType(CreateMatriculaDto) {}
