import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProgressoAulaDto } from './dto/create-progresso-aula.dto';
import { UpdateProgressoAulaDto } from './dto/update-progresso-aula.dto';

@Injectable()
export class ProgressoAulasService {
  constructor(private prisma: PrismaService) {}

  create(createProgressoAulaDto: CreateProgressoAulaDto) {
    return this.prisma.progressoAula.create({ data: createProgressoAulaDto });
  }

  findAll() {
    return this.prisma.progressoAula.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const progressoAula = await this.prisma.progressoAula.findUnique({
      where: { id },
    });
    if (!progressoAula)
      throw new NotFoundException(
        `Registro de progresso de aula #${id} não encontrado.`,
      );
    return progressoAula;
  }

  update(id: number, updateProgressoAulaDto: UpdateProgressoAulaDto) {
    return this.prisma.progressoAula.update({
      where: { id },
      data: updateProgressoAulaDto,
    });
  }

  remove(id: number) {
    return this.prisma.progressoAula.delete({ where: { id } });
  }
}
