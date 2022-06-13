import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  FilterType,
  Product,
} from '@prisma/client';

export class GetFilterDTO {
  @IsNotEmpty()
  @IsString()
  name_tm: string;

  @IsNotEmpty()
  @IsString()
  name_ru: string;

  @IsNotEmpty()
  @IsEnum(FilterType)
  type: FilterType;

  @IsOptional()
  products?: Product[];
}
