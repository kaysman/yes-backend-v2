import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
} from 'class-validator';
import { PaginationDTO } from 'src/shared/dto/pagination.dto';

export class FilterForProductDTO extends PaginationDTO {

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  priceFrom?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  priceTo?: number;

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

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  size_id: number
}
