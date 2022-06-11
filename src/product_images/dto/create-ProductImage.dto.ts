import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateProductImageDTO{

    @IsNotEmpty()
    @IsString()
    image: string

    @IsNotEmpty()
    @IsNumber()
    @Type(()=>Number)
    productId : number
}