import { IsNotEmpty, IsOptional, IsString } from "class-validator";

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
}