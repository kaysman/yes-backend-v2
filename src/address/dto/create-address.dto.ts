import { Transform, Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAddressDTO {
    @IsString()
    @IsNotEmpty()
    addressLine1: string;

    @IsString()
    @IsOptional()
    addressLine2: string;

    @IsString()
    @IsOptional()
    title: string;

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    userId: number;

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
    default?: boolean;
}