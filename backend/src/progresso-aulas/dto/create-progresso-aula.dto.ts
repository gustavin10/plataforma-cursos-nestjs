import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsIn, IsInt, IsOptional, Min } from 'class-validator';

export class CreateProgressoAulaDto {
  @ApiProperty({ example: 4, description: 'ID do aluno' })
  @IsInt()
  @Min(1)
  idUsuario!: number;

  @ApiProperty({ example: 1, description: 'ID da aula' })
  @IsInt()
  @Min(1)
  idAula!: number;

  @ApiPropertyOptional({
    example: '2025-03-13',
    description: 'Data de conclusão (opcional)',
    type: String,
    format: 'date',
    nullable: true,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dataConclusao?: Date | null;

  @ApiProperty({
    example: 'Concluído',
    description: 'Status do progresso',
    enum: ['Não Iniciado', 'Em Progresso', 'Concluído'],
  })
  @IsIn(['Não Iniciado', 'Em Progresso', 'Concluído'])
  status!: string;
}
