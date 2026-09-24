import { PartialType } from '@nestjs/swagger';
import { CreateUsuarioDto } from './create-usuario.dto';

// Todos os campos do CreateUsuarioDto tornam-se opcionais na atualização (PATCH)
export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {}
