import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Injectable()
export class CursosService {
  constructor(private prisma: PrismaService) {}

  create(createCursoDto: CreateCursoDto) {
    return this.prisma.curso.create({ data: createCursoDto });
  }

  findAll() {
    return this.prisma.curso.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const curso = await this.prisma.curso.findUnique({ where: { id } });
    if (!curso)
      throw new NotFoundException(`Registro de curso #${id} não encontrado.`);
    return curso;
  }

  update(id: number, updateCursoDto: UpdateCursoDto) {
    return this.prisma.curso.update({
      where: { id },
      data: updateCursoDto,
    });
  }

  remove(id: number) {
    return this.prisma.curso.delete({ where: { id } });
  }
}
