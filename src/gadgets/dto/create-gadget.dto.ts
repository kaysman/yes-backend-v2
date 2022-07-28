import { GadgetLocation, STATUS } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { GadgetType } from "src/shared/enums/home_gadget.enum";

export class CreateGadget {
    @IsNotEmpty()
    @IsEnum(GadgetType)
    type: GadgetType;

    // optional title to be used for 
    // gadgets with 'TITLE AS TEXT'
    @IsOptional()
    @IsString()
    title?: string;

    @IsNotEmpty()
    @IsString()
    links: CreateGadgetLink[]

    // when type is 
    // TWO_TO_THREE_PRODUCTS_IN_HORIZONTAL_WITH_TITLE_AS_TEXT
    @IsOptional()
    @IsString()
    productIds?: CreateGadgetProducts[];

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    queue: number = 1;

    @IsEnum(STATUS)
    @IsOptional()
    status: STATUS

    @IsEnum(GadgetLocation)
    @IsOptional()
    location: GadgetLocation

}

export class CreateGadgetLink {
    @IsNotEmpty()
    @IsString()
    link: string

    @IsOptional()
    subcategories: CreateGadgetSubCategory[];
}

export class CreateGadgetProducts {
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    productId: number
}

export class CreateGadgetSubCategory{
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    categoryId: number;
}


