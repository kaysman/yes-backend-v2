import { ORDER_STATUS } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateOrderDTO {

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    id: number
    
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    addressId: number

    @IsOptional()
    @IsString()
    note: string

    @IsOptional()
    @IsEnum(ORDER_STATUS)
    status: ORDER_STATUS

}