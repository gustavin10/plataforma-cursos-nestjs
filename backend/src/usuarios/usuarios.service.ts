import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt'; // Biblioteca para hash de senha
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

// Remove o campo senha (hash) de todas as respostas da API
const SEM_SENHA = { senha: true } as const;

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    // Gera um salt e cria o hash da senha enviada pelo DTO
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUsuarioDto.senha, salt);

    // Salva o usuário no banco com a senha criptografada
    return this.prisma.usuario.create({
      data: { ...createUsuarioDto, senha: hash },
      omit: SEM_SENHA,
    });
  }

  findAll() {
    return this.prisma.usuario.findMany({
      orderBy: { id: 'asc' },
      omit: SEM_SENHA,
    });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      omit: SEM_SENHA,
    });
    if (!usuario) throw new NotFoundException(`Usuário #${id} não encontrado.`);
    return usuario;
  }

  // Método essencial para buscar usuário pelo e-mail durante o login (inclui o hash da senha)
  findByEmail(email: string) {
    return this.prisma.usuario.findUnique({ where: { email } });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const data = { ...updateUsuarioDto };
    // Se uma nova senha foi enviada, ela também é salva como hash
    if (data.senha) {
      data.senha = await bcrypt.hash(data.senha, await bcrypt.genSalt());
    }
    return this.prisma.usuario.update({ where: { id }, data, omit: SEM_SENHA });
  }

  remove(id: number) {
    return this.prisma.usuario.delete({ where: { id }, omit: SEM_SENHA });
  }
}
