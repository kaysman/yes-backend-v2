import { GadgetLocation, STATUS } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { GadgetType } from "src/shared/enums/home_gadget.enum";

export class UpdateGadgetDTO {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    id: number

    @IsOptional()
    @IsString()
    title?: string;

    // @IsOptional()
    // @IsString()
    // links: CreateGadgetLink[]

    // @IsOptional()
    // @IsString()
    // productIds?: CreateGadgetProducts[];

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    queue: number;

    @IsEnum(STATUS)
    @IsOptional()
    status: STATUS

    @IsEnum(GadgetLocation)
    @IsOptional()
    location: GadgetLocation

}

// export class CreateGadgetLink {
//     @IsNotEmpty()
//     @IsString()
//     link: string

//     @IsOptional()
//     subcategories: CreateGadgetSubCategory[];
// }

// export class CreateGadgetProducts {
//     @IsNumber()
//     @IsNotEmpty()
//     @Type(() => Number)
//     productId: number
// }

// export class CreateGadgetSubCategory{
//     @IsNotEmpty()
//     @IsNumber()
//     @Type(() => Number)
//     categoryId: number;
// }


