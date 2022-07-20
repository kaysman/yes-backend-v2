import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { SizeItemDTO } from "./create-product.dto";

export class UpdateProductDTO {

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    id: number

    @IsString()
    @IsOptional()
    name_tm?: string;

    @IsString()
    @IsOptional()
    name_ru?: string;

    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    ourPrice: number;

    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    marketPrice: number;

    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    color_id: number;

    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    gender_id: number;

    @IsString()
    @IsOptional()
    description_tm?: string;

    @IsString()
    @IsOptional()
    description_ru?: string;

    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    brand_id: number;

    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    category_id: number;

    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    market_id: number;

    @IsOptional()
    @IsString()
    sizes: SizeItemDTO[]
}