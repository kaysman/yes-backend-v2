import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class FilterForProductDTO {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lastProductId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  take?: number = 10;

  @IsOptional()
  @IsString()
  name_tm?: string;

  @IsOptional()
  @IsString()
  name_ru?: string;

  @IsOptional()
  @IsString()
  price?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  color_id?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  gender_id?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  quantity?: number;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  description_tm?: string;

  @IsOptional()
  @IsString()
  description_ru?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  brand_id?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  category_id?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  market_id?: number;
}
