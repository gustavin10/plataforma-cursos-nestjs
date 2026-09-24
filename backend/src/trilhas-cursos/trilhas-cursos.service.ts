import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrilhaCursoDto } from './dto/create-trilha-curso.dto';
import { UpdateTrilhaCursoDto } from './dto/update-trilha-curso.dto';

@Injectable()
export class TrilhasCursosService {
  constructor(private prisma: PrismaService) {}

  create(createTrilhaCursoDto: CreateTrilhaCursoDto) {
    return this.prisma.trilhaCurso.create({ data: createTrilhaCursoDto });
  }

  findAll() {
    return this.prisma.trilhaCurso.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const trilhaCurso = await this.prisma.trilhaCurso.findUnique({
      where: { id },
    });
    if (!trilhaCurso)
      throw new NotFoundException(
        `Registro de vínculo trilha x curso #${id} não encontrado.`,
      );
    return trilhaCurso;
  }

  update(id: number, updateTrilhaCursoDto: UpdateTrilhaCursoDto) {
    return this.prisma.trilhaCurso.update({
      where: { id },
      data: updateTrilhaCursoDto,
    });
  }

  remove(id: number) {
    return this.prisma.trilhaCurso.delete({ where: { id } });
  }
}
