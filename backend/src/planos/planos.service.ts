import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';

@Injectable()
export class PlanosService {
  constructor(private prisma: PrismaService) {}

  create(createPlanoDto: CreatePlanoDto) {
    return this.prisma.plano.create({ data: createPlanoDto });
  }

  findAll() {
    return this.prisma.plano.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const plano = await this.prisma.plano.findUnique({ where: { id } });
    if (!plano)
      throw new NotFoundException(`Registro de plano #${id} não encontrado.`);
    return plano;
  }

  update(id: number, updatePlanoDto: UpdatePlanoDto) {
    return this.prisma.plano.update({
      where: { id },
      data: updatePlanoDto,
    });
  }

  remove(id: number) {
    return this.prisma.plano.delete({ where: { id } });
  }
}
