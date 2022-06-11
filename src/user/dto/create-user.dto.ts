import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  GenderType,
  RoleType,
} from '@prisma/client';

export class CreateUserDTO{

    @IsString()
    @IsOptional()
    name?: string 

    @IsString()
    @IsNotEmpty()
    phoneNumber: string 

    @IsString()
    @IsNotEmpty()
    password : string
    
    @IsString()
    @IsNotEmpty()
    address : string 

    @IsOptional()
    @IsEnum(GenderType)
    gender?:  GenderType

    @IsNotEmpty()
    @IsEnum(RoleType)
    role: RoleType

    @IsString()
    @IsOptional()
    image?: string
    
}