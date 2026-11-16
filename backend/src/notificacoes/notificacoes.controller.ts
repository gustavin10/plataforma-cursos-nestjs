import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { NotificacoesService } from './notificacoes.service';

type RequisicaoAutenticada = { user: { userId: number } };

@ApiTags('notificacoes')
@ApiBearerAuth('token')
@UseGuards(AuthGuard('jwt'))
@ApiResponse({ status: 401, description: 'Token ausente ou inválido.' })
@Controller('notificacoes')
export class NotificacoesController {
  constructor(private readonly notificacoesService: NotificacoesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar as notificações do usuário logado' })
  listar(@Request() req: RequisicaoAutenticada) {
    return this.notificacoesService.doUsuario(req.user.userId);
  }

  @Patch(':id/lida')
  @ApiOperation({ summary: 'Marcar uma notificação como lida' })
  @ApiResponse({ status: 404, description: 'Notificação não encontrada.' })
  marcarComoLida(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: RequisicaoAutenticada,
  ) {
    return this.notificacoesService.marcarComoLida(id, req.user.userId);
  }
}
