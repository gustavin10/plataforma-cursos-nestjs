import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';

@Injectable()
export class AvaliacoesService {
  constructor(private prisma: PrismaService) {}

  create(createAvaliacaoDto: CreateAvaliacaoDto) {
    return this.prisma.avaliacao.create({ data: createAvaliacaoDto });
  }

  findAll() {
    return this.prisma.avaliacao.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const avaliacao = await this.prisma.avaliacao.findUnique({ where: { id } });
    if (!avaliacao)
      throw new NotFoundException(
        `Registro de avaliação #${id} não encontrado.`,
      );
    return avaliacao;
  }

  update(id: number, updateAvaliacaoDto: UpdateAvaliacaoDto) {
    return this.prisma.avaliacao.update({
      where: { id },
      data: updateAvaliacaoDto,
    });
  }

  remove(id: number) {
    return this.prisma.avaliacao.delete({ where: { id } });
  }
}
