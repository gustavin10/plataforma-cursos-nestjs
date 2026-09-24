import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(private prisma: PrismaService) {}

  create(createCategoriaDto: CreateCategoriaDto) {
    return this.prisma.categoria.create({ data: createCategoriaDto });
  }

  findAll() {
    return this.prisma.categoria.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const categoria = await this.prisma.categoria.findUnique({ where: { id } });
    if (!categoria)
      throw new NotFoundException(
        `Registro de categoria #${id} não encontrado.`,
      );
    return categoria;
  }

  update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    return this.prisma.categoria.update({
      where: { id },
      data: updateCategoriaDto,
    });
  }

  remove(id: number) {
    return this.prisma.categoria.delete({ where: { id } });
  }
}
