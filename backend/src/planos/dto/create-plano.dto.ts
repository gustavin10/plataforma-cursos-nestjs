import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreatePlanoDto {
  @ApiProperty({ example: 'Mensal', description: 'Nome do plano' })
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @ApiProperty({
    example: 'Acesso a todos os cursos por 1 mês.',
    description: 'Descrição do plano',
  })
  @IsString()
  @IsNotEmpty()
  descricao!: string;

  @ApiProperty({ example: 49.9, description: 'Preço em R$' })
  @IsNumber()
  @Min(0)
  preco!: number;

  @ApiProperty({ example: 1, description: 'Duração em meses' })
  @IsInt()
  @Min(1)
  duracaoMeses!: number;
}
