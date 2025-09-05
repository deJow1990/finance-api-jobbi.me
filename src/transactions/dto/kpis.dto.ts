import { IsISO8601, IsOptional } from 'class-validator';

export class KpisDto {
  @IsOptional() 
  @IsISO8601() 
  start?: string;

  @IsOptional() 
  @IsISO8601() 
  end?: string;
}