import { IsUUID, IsNumber, IsISO8601, IsOptional, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID() 
  categoryId: string;

  @IsNumber() 
  amount: number;
  
  @IsISO8601() 
  occurredAt: string;

  @IsOptional() 
  @IsString() 
  note?: string;
}