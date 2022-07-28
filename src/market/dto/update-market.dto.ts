import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateMarketDTO{
      @IsNotEmpty()
      @IsNumber()
      @Type(() => Number)
      id: number;

      @IsOptional()
      @IsString()
      title: string
  
      @IsString()
      @IsOptional()
      address: string
  
      @IsString()
      @IsOptional()
      description: string
  
      @IsString()
      @IsOptional()
      phoneNumber: string
  
      @IsString()
      @IsOptional()
      ownerName : string
  
  }