import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateCertificadoDto {
  @ApiProperty({ example: 5, description: 'ID do aluno' })
  @IsInt()
  @Min(1)
  idUsuario!: number;

  @ApiProperty({ example: 1, description: 'ID do curso' })
  @IsInt()
  @Min(1)
  idCurso!: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID da trilha (opcional)',
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  idTrilha?: number | null;

  @ApiProperty({
    example: 'GM-A1B2-C3D4-E5F6',
    description: 'Código de verificação único',
  })
  @IsString()
  @IsNotEmpty()
  codigoVerificacao!: string;

  @ApiProperty({
    example: '2025-05-21',
    description: 'Data de emissão (aaaa-mm-dd)',
    type: String,
    format: 'date',
  })
  @Type(() => Date)
  @IsDate()
  dataEmissao!: Date;
}
