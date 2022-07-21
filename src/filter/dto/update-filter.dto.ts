import { FilterType } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateFilterDTO {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    id: number;

    @IsOptional()
    @IsString()
    name_tm: string;

    @IsOptional()
    @IsString()
    name_ru: string;

    @IsOptional()
    @IsEnum(FilterType)
    type: FilterType;

}