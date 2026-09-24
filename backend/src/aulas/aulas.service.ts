import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';

@Injectable()
export class AulasService {
  constructor(private prisma: PrismaService) {}

  create(createAulaDto: CreateAulaDto) {
    return this.prisma.aula.create({ data: createAulaDto });
  }

  findAll() {
    return this.prisma.aula.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const aula = await this.prisma.aula.findUnique({ where: { id } });
    if (!aula)
      throw new NotFoundException(`Registro de aula #${id} não encontrado.`);
    return aula;
  }

  update(id: number, updateAulaDto: UpdateAulaDto) {
    return this.prisma.aula.update({
      where: { id },
      data: updateAulaDto,
    });
  }

  remove(id: number) {
    return this.prisma.aula.delete({ where: { id } });
  }
}
