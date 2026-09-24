import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateAulaDto {
  @ApiProperty({ example: 1, description: 'ID do módulo' })
  @IsInt()
  @Min(1)
  idModulo!: number;

  @ApiProperty({ example: 'O que é React?', description: 'Título da aula' })
  @IsString()
  @IsNotEmpty()
  titulo!: string;

  @ApiProperty({
    example: 'Vídeo',
    description: 'Tipo de conteúdo',
    enum: ['Vídeo', 'Texto', 'Quiz'],
  })
  @IsIn(['Vídeo', 'Texto', 'Quiz'])
  tipoConteudo!: string;

  @ApiProperty({
    example: 'https://exemplo.com/aula1',
    description: 'URL do conteúdo (pode ficar vazia em aulas de texto/quiz)',
  })
  @IsString()
  urlConteudo!: string;

  @ApiProperty({ example: 12, description: 'Duração em minutos' })
  @IsInt()
  @Min(0)
  duracaoMinutos!: number;

  @ApiProperty({ example: 1, description: 'Ordem da aula dentro do módulo' })
  @IsInt()
  @Min(1)
  ordem!: number;
}
