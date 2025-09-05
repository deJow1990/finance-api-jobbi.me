import { IsEnum, IsString, MaxLength } from 'class-validator';
import { CategoryType } from '../category-type.enum';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsEnum(CategoryType)
  type: CategoryType;
}