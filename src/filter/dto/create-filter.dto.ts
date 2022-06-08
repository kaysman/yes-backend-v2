import {
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

import { FilterType } from '@prisma/client';

export class CreateFilterDTO {
  @IsNotEmpty()
  @IsString()
  name_tm: string;

  @IsNotEmpty()
  @IsString()
  name_ru: string;

  @IsNotEmpty()
  @IsEnum(FilterType)
  type: FilterType;
}
