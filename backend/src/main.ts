import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Libera o acesso do frontend React (Vite) à API.
  // Aceita localhost/127.0.0.1 em qualquer porta (o Vite pode subir em 5174, 5175...)
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? /^http:\/\/(localhost|127\.0\.0\.1):\d+$/,
  });

  // Ativa validação dos DTOs:
  // whitelist remove campos que não estão no DTO; transform converte datas/tipos
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Traduz erros do Prisma (e-mail duplicado, FK, não encontrado) em respostas HTTP
  app.useGlobalFilters(new PrismaExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Plataforma de Cursos API')
    .setDescription(
      'Documentação da API da Plataforma de Cursos Online com NestJS, Prisma, PostgreSQL e JWT',
    )
    .setVersion('1.0')
    .addTag('auth')
    .addTag('usuarios')
    .addBearerAuth(
      // Adiciona o campo de autenticação no Swagger (botão "Authorize")
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        in: 'header',
      },
      'token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { persistAuthorization: true }, // mantém o token ao recarregar a página
  });

  const porta = process.env.PORT ?? 3000;
  await app.listen(porta);
  console.log(
    `API rodando em http://localhost:${porta} — Swagger em http://localhost:${porta}/api`,
  );
}
bootstrap();
