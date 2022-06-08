import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCategoryDTO {
  @IsString()
  @IsNotEmpty()
  title_tm: string;

  @IsString()
  @IsOptional()
  title_ru?: string;

  @IsString()
  @IsOptional()
  description_tm?: string;

  @IsString()
  @IsOptional()
  description_ru?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  parentId?: number;
}
