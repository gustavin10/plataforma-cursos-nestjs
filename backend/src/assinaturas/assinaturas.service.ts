import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssinaturaDto } from './dto/create-assinatura.dto';
import { UpdateAssinaturaDto } from './dto/update-assinatura.dto';

@Injectable()
export class AssinaturasService {
  constructor(private prisma: PrismaService) {}

  create(createAssinaturaDto: CreateAssinaturaDto) {
    return this.prisma.assinatura.create({ data: createAssinaturaDto });
  }

  findAll() {
    return this.prisma.assinatura.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const assinatura = await this.prisma.assinatura.findUnique({
      where: { id },
    });
    if (!assinatura)
      throw new NotFoundException(
        `Registro de assinatura #${id} não encontrado.`,
      );
    return assinatura;
  }

  update(id: number, updateAssinaturaDto: UpdateAssinaturaDto) {
    return this.prisma.assinatura.update({
      where: { id },
      data: updateAssinaturaDto,
    });
  }

  remove(id: number) {
    return this.prisma.assinatura.delete({ where: { id } });
  }
}
