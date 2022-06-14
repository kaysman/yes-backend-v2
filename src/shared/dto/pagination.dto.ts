import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
} from 'class-validator';

export class PaginationDTO {

    @IsOptional()
    @IsNumber()
    @Type(()=> Number)
    lastId? : number;

    @IsOptional()
    @IsNumber()
    @Type(()=> Number)
    take? : number = 10;

    @IsOptional()
    search? : string;
}