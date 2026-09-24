import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

export class CreateCursoDto {
  @ApiProperty({
    example: 'React do Zero ao Avançado',
    description: 'Título do curso',
  })
  @IsString()
  @IsNotEmpty()
  titulo!: string;

  @ApiProperty({
    example: 'Construa aplicações modernas com React e TypeScript.',
    description: 'Descrição do curso',
  })
  @IsString()
  @IsNotEmpty()
  descricao!: string;

  @ApiProperty({ example: 2, description: 'ID do usuário instrutor' })
  @IsInt()
  @Min(1)
  idInstrutor!: number;

  @ApiProperty({ example: 1, description: 'ID da categoria' })
  @IsInt()
  @Min(1)
  idCategoria!: number;

  @ApiProperty({
    example: 'Intermediário',
    description: 'Nível do curso',
    enum: ['Iniciante', 'Intermediário', 'Avançado'],
  })
  @IsIn(['Iniciante', 'Intermediário', 'Avançado'])
  nivel!: string;

  @ApiProperty({
    example: '2025-03-10',
    description: 'Data de publicação (aaaa-mm-dd)',
    type: String,
    format: 'date',
  })
  @Type(() => Date)
  @IsDate()
  dataPublicacao!: Date;

  @ApiProperty({ example: 24, description: 'Quantidade total de aulas' })
  @IsInt()
  @Min(0)
  totalAulas!: number;

  @ApiProperty({ example: 18, description: 'Carga horária total em horas' })
  @IsInt()
  @Min(0)
  totalHoras!: number;
}
