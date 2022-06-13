import {
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateMarketDTO{
      @IsOptional()
      @IsString()
      title?: string
  
      @IsString()
      @IsOptional()
      logo?: string
  
      @IsString()
      @IsOptional()
      address?: string
  
      @IsString()
      @IsOptional()
      description?: string
  
      @IsString()
      @IsOptional()
      phoneNumber?: string
  
      @IsString()
      @IsOptional()
      ownerName? : string
  
  }