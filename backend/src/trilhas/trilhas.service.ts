import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrilhaDto } from './dto/create-trilha.dto';
import { UpdateTrilhaDto } from './dto/update-trilha.dto';

@Injectable()
export class TrilhasService {
  constructor(private prisma: PrismaService) {}

  create(createTrilhaDto: CreateTrilhaDto) {
    return this.prisma.trilha.create({ data: createTrilhaDto });
  }

  findAll() {
    return this.prisma.trilha.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const trilha = await this.prisma.trilha.findUnique({ where: { id } });
    if (!trilha)
      throw new NotFoundException(`Registro de trilha #${id} não encontrado.`);
    return trilha;
  }

  update(id: number, updateTrilhaDto: UpdateTrilhaDto) {
    return this.prisma.trilha.update({
      where: { id },
      data: updateTrilhaDto,
    });
  }

  remove(id: number) {
    return this.prisma.trilha.delete({ where: { id } });
  }
}
