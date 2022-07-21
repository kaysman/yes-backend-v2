import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateBrandDTO {
  @IsNumber()
  @Type(()=>Number)
  @IsNotEmpty()
  id: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(it => {
    switch (it.value) {
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        return it;
    }
  })
  vip?: boolean;
}
