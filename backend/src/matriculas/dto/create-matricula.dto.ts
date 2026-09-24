import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, Min } from 'class-validator';

export class CreateMatriculaDto {
  @ApiProperty({ example: 4, description: 'ID do aluno' })
  @IsInt()
  @Min(1)
  idUsuario!: number;

  @ApiProperty({ example: 1, description: 'ID do curso' })
  @IsInt()
  @Min(1)
  idCurso!: number;

  @ApiProperty({
    example: '2025-03-12',
    description: 'Data da matrícula (aaaa-mm-dd)',
    type: String,
    format: 'date',
  })
  @Type(() => Date)
  @IsDate()
  dataMatricula!: Date;

  @ApiPropertyOptional({
    example: '2025-05-20',
    description: 'Data de conclusão (opcional)',
    type: String,
    format: 'date',
    nullable: true,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dataConclusao?: Date | null;
}
