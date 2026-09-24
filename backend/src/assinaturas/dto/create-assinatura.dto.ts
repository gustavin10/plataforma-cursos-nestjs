import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, Min } from 'class-validator';

export class CreateAssinaturaDto {
  @ApiProperty({ example: 4, description: 'ID do usuário assinante' })
  @IsInt()
  @Min(1)
  idUsuario!: number;

  @ApiProperty({ example: 2, description: 'ID do plano' })
  @IsInt()
  @Min(1)
  idPlano!: number;

  @ApiProperty({
    example: '2025-03-12',
    description: 'Início da assinatura (aaaa-mm-dd)',
    type: String,
    format: 'date',
  })
  @Type(() => Date)
  @IsDate()
  dataInicio!: Date;

  @ApiProperty({
    example: '2025-06-12',
    description: 'Fim da assinatura (aaaa-mm-dd)',
    type: String,
    format: 'date',
  })
  @Type(() => Date)
  @IsDate()
  dataFim!: Date;
}
