import { Type } from "class-transformer"
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateOrderDTO {
    @IsNotEmpty()
    @IsString()
    products: CreateOrderItem[]

    @IsNotEmpty()
    contact: ContactDetails

    @IsOptional()
    @IsString()
    note: string
}

export class CreateOrderItem {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    productId: number

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    quantity: number

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    size_id: number
}

export class ContactDetails {
    @IsNotEmpty()
    @IsString()
    phonenumber: string
    
    @IsNotEmpty()
    @IsString()
    address: string

    @IsOptional()
    @IsString()
    name: string
}