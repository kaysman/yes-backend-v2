import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMarketDTO {

    @IsNotEmpty()
    @IsString()
    title: string

    @IsString()
    @IsOptional()
    address?: string

    @IsString()
    @IsOptional()
    description?: string

    @IsString()
    @IsNotEmpty()
    phoneNumber: string

    @IsString()
    @IsOptional()
    ownerName? : string

}