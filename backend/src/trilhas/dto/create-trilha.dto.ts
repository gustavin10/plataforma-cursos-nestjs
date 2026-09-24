import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateTrilhaDto {
  @ApiProperty({
    example: 'Desenvolvedor Front-End',
    description: 'Título da trilha',
  })
  @IsString()
  @IsNotEmpty()
  titulo!: string;

  @ApiProperty({
    example: 'Trilha completa para se tornar dev front-end.',
    description: 'Descrição da trilha',
  })
  @IsString()
  @IsNotEmpty()
  descricao!: string;

  @ApiProperty({ example: 1, description: 'ID da categoria' })
  @IsInt()
  @Min(1)
  idCategoria!: number;
}
