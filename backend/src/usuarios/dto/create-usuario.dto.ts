import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'João Oliveira', description: 'Nome completo' })
  @IsString()
  @IsNotEmpty()
  nomeCompleto!: string;

  @ApiProperty({ example: 'joao@email.com', description: 'E-mail (único)' })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'senha123',
    description: 'Senha com no mínimo 6 caracteres',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  senha!: string;

  @ApiProperty({
    example: 'aluno',
    description: 'Perfil do usuário',
    enum: ['administrador', 'instrutor', 'aluno'],
  })
  @IsIn(['administrador', 'instrutor', 'aluno'])
  perfil!: string;

  @ApiPropertyOptional({
    example: '2025-03-01',
    description: 'Data de cadastro (padrão: hoje)',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dataCadastro?: Date;
}
