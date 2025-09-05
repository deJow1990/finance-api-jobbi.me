import { IsEnum, IsISO8601, IsOptional, IsUUID } from 'class-validator';
import { EntryType } from '../entry-type.enum';

export class QueryTransactionsDto {
  @IsOptional() 
  @IsEnum(EntryType) 
  type?: EntryType;

  @IsOptional() 
  @IsISO8601() 
  start?: string;

  @IsOptional() 
  @IsISO8601() 
  end?: string;

  @IsOptional() 
  @IsUUID() 
  categoryId?: string;

  @IsOptional() 
  limit?: number;

  @IsOptional() 
  offset?: number;
}