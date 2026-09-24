import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreatePagamentoDto {
  @ApiProperty({ example: 1, description: 'ID da assinatura' })
  @IsInt()
  @Min(1)
  idAssinatura!: number;

  @ApiProperty({ example: 129.9, description: 'Valor pago em R$' })
  @IsNumber()
  @Min(0)
  valorPago!: number;

  @ApiProperty({
    example: '2025-03-12',
    description: 'Data do pagamento (aaaa-mm-dd)',
    type: String,
    format: 'date',
  })
  @Type(() => Date)
  @IsDate()
  dataPagamento!: Date;

  @ApiProperty({
    example: 'Pix',
    description: 'Método de pagamento',
    enum: ['Cartão de Crédito', 'Boleto', 'Pix'],
  })
  @IsIn(['Cartão de Crédito', 'Boleto', 'Pix'])
  metodoPagamento!: string;

  @ApiProperty({
    example: 'TXN-1741800000-1234',
    description: 'ID da transação no gateway',
  })
  @IsString()
  @IsNotEmpty()
  idTransacaoGateway!: string;
}
