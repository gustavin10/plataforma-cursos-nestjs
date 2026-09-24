import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateAvaliacaoDto {
  @ApiProperty({ example: 5, description: 'ID do aluno' })
  @IsInt()
  @Min(1)
  idUsuario!: number;

  @ApiProperty({ example: 1, description: 'ID do curso' })
  @IsInt()
  @Min(1)
  idCurso!: number;

  @ApiProperty({ example: 5, description: 'Nota de 1 a 5' })
  @IsInt()
  @Min(1)
  @Max(5)
  nota!: number;

  @ApiPropertyOptional({
    example: 'Curso excelente, muito didático!',
    description: 'Comentário (opcional)',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  comentario?: string | null;

  @ApiProperty({
    example: '2025-05-21',
    description: 'Data da avaliação (aaaa-mm-dd)',
    type: String,
    format: 'date',
  })
  @Type(() => Date)
  @IsDate()
  dataAvaliacao!: Date;
}
