import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateTrilhaCursoDto {
  @ApiProperty({ example: 1, description: 'ID da trilha' })
  @IsInt()
  @Min(1)
  idTrilha!: number;

  @ApiProperty({ example: 2, description: 'ID do curso' })
  @IsInt()
  @Min(1)
  idCurso!: number;

  @ApiProperty({ example: 1, description: 'Posição do curso na trilha' })
  @IsInt()
  @Min(1)
  ordem!: number;
}
