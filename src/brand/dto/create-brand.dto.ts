import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBrandDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  vip: boolean;

  @IsNotEmpty()
  @IsString()
  logo: string;

  @IsOptional()
  @IsString()
  image?: string;
}
