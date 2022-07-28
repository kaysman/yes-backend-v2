import { Transform, Type } from 'class-transformer';
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
  vip: boolean = false;
}
