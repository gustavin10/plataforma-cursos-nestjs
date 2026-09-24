import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCertificadoDto } from './dto/create-certificado.dto';
import { UpdateCertificadoDto } from './dto/update-certificado.dto';

@Injectable()
export class CertificadosService {
  constructor(private prisma: PrismaService) {}

  create(createCertificadoDto: CreateCertificadoDto) {
    return this.prisma.certificado.create({ data: createCertificadoDto });
  }

  findAll() {
    return this.prisma.certificado.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const certificado = await this.prisma.certificado.findUnique({
      where: { id },
    });
    if (!certificado)
      throw new NotFoundException(
        `Registro de certificado #${id} não encontrado.`,
      );
    return certificado;
  }

  update(id: number, updateCertificadoDto: UpdateCertificadoDto) {
    return this.prisma.certificado.update({
      where: { id },
      data: updateCertificadoDto,
    });
  }

  remove(id: number) {
    return this.prisma.certificado.delete({ where: { id } });
  }
}
