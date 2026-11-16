import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, Min } from 'class-validator';

export const METODOS_PAGAMENTO = ['Pix', 'Cartão de Crédito', 'Boleto'];

export class MatricularDto {
  @ApiProperty({ example: 1, description: 'ID do curso' })
  @IsInt()
  @Min(1)
  idCurso!: number;

  @ApiPropertyOptional({
    example: 1,
    description:
      'Plano a contratar (obrigatório se o aluno não tiver assinatura ativa)',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  idPlano?: number;

  @ApiPropertyOptional({
    example: 'Pix',
    enum: METODOS_PAGAMENTO,
    description: 'Forma de pagamento (obrigatória junto com o plano)',
  })
  @IsOptional()
  @IsIn(METODOS_PAGAMENTO)
  metodoPagamento?: string;
}
