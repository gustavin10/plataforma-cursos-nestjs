import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateModuloDto {
  @ApiProperty({ example: 1, description: 'ID do curso' })
  @IsInt()
  @Min(1)
  idCurso!: number;

  @ApiProperty({
    example: 'Introdução ao React',
    description: 'Título do módulo',
  })
  @IsString()
  @IsNotEmpty()
  titulo!: string;

  @ApiProperty({ example: 1, description: 'Ordem do módulo dentro do curso' })
  @IsInt()
  @Min(1)
  ordem!: number;
}
