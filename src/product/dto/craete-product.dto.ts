import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  name_tm: string;

  @IsString()
  @IsNotEmpty()
  name_ru: string;

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  color_id: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  gender_id: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsOptional()
  description_tm?: string;

  @IsString()
  @IsOptional()
  description_ru?: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  brand_id: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  category_id: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  market_id: number;
}
