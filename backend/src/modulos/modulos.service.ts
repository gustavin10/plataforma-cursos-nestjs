import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { UpdateModuloDto } from './dto/update-modulo.dto';

@Injectable()
export class ModulosService {
  constructor(private prisma: PrismaService) {}

  create(createModuloDto: CreateModuloDto) {
    return this.prisma.modulo.create({ data: createModuloDto });
  }

  findAll() {
    return this.prisma.modulo.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const modulo = await this.prisma.modulo.findUnique({ where: { id } });
    if (!modulo)
      throw new NotFoundException(`Registro de módulo #${id} não encontrado.`);
    return modulo;
  }

  update(id: number, updateModuloDto: UpdateModuloDto) {
    return this.prisma.modulo.update({
      where: { id },
      data: updateModuloDto,
    });
  }

  remove(id: number) {
    return this.prisma.modulo.delete({ where: { id } });
  }
}
