import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateBrandDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  vip: boolean = false;
}
