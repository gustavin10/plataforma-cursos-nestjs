import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoriaDto {
  @ApiProperty({ example: 'Programação', description: 'Nome da categoria' })
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @ApiProperty({
    example: 'Cursos de desenvolvimento de software.',
    description: 'Descrição da categoria',
  })
  @IsString()
  @IsNotEmpty()
  descricao!: string;
}
