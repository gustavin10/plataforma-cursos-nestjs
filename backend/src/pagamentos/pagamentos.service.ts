import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';

@Injectable()
export class PagamentosService {
  constructor(private prisma: PrismaService) {}

  create(createPagamentoDto: CreatePagamentoDto) {
    return this.prisma.pagamento.create({ data: createPagamentoDto });
  }

  findAll() {
    return this.prisma.pagamento.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const pagamento = await this.prisma.pagamento.findUnique({ where: { id } });
    if (!pagamento)
      throw new NotFoundException(
        `Registro de pagamento #${id} não encontrado.`,
      );
    return pagamento;
  }

  update(id: number, updatePagamentoDto: UpdatePagamentoDto) {
    return this.prisma.pagamento.update({
      where: { id },
      data: updatePagamentoDto,
    });
  }

  remove(id: number) {
    return this.prisma.pagamento.delete({ where: { id } });
  }
}
