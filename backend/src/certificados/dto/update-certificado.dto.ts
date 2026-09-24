import { PartialType } from '@nestjs/swagger';
import { CreateCertificadoDto } from './create-certificado.dto';

// Todos os campos do CreateCertificadoDto tornam-se opcionais na atualização (PATCH)
export class UpdateCertificadoDto extends PartialType(CreateCertificadoDto) {}
