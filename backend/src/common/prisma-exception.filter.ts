import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '../generated/prisma/client';

// Converte os erros do Prisma em respostas HTTP amigáveis, em vez de um erro 500.
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    const erros: Record<string, { status: number; message: string }> = {
      // Violação de campo único (ex.: e-mail já cadastrado)
      P2002: {
        status: HttpStatus.CONFLICT,
        message:
          'Já existe um registro com este valor (campo único, ex.: e-mail).',
      },
      // Violação de chave estrangeira (ex.: ID inexistente ou registro em uso)
      P2003: {
        status: HttpStatus.CONFLICT,
        message:
          'Operação não permitida: o registro referenciado não existe ou está vinculado a outros dados.',
      },
      // Registro não encontrado no update/delete
      P2025: {
        status: HttpStatus.NOT_FOUND,
        message: 'Registro não encontrado.',
      },
    };

    const erro = erros[exception.code] ?? {
      status: HttpStatus.BAD_REQUEST,
      message: `Erro no banco de dados (${exception.code}).`,
    };

    response.status(erro.status).json({
      statusCode: erro.status,
      message: erro.message,
      error: exception.code,
    });
  }
}
