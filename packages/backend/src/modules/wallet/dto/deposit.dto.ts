import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class DepositDto {
  @ApiProperty({ example: 10000 })
  @IsNumber()
  @Min(100)
  amount: number;

  @ApiProperty({ example: 'Wallet funding' })
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reference?: string;
}