import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class TransferDto {
  @ApiProperty({ example: 7500 })
  @IsNumber()
  @Min(100)
  amount: number;

  @ApiProperty({ example: '9012345678' })
  @IsString()
  recipientAccountNumber: string;

  @ApiProperty({ example: 'Transfer to friend' })
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reference?: string;
}