import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
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
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK) // POST retorna 201 por padrão; no login o correto é 200
  @ApiOperation({ summary: 'Autenticar usuário e gerar token JWT' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'E-mail ou senha incorretos.' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // Devolve os dados do token do usuário logado (útil para testar o JWT no Swagger)
  @ApiBearerAuth('token')
  @UseGuards(AuthGuard('jwt'))
  @Get('perfil')
  @ApiOperation({ summary: 'Dados do usuário autenticado (lidos do token)' })
  @ApiResponse({ status: 200, description: 'Token válido.' })
  @ApiResponse({ status: 401, description: 'Token ausente ou inválido.' })
  perfil(
    @Request() req: { user: { userId: number; email: string; perfil: string } },
  ) {
    return req.user;
  }
}
