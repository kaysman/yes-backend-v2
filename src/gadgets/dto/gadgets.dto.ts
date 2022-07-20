import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { HomeGadgetType } from "src/shared/enums/home_gadget.enum";

export class CreateHomeGadget {

    @IsNotEmpty()
    @IsEnum(HomeGadgetType)
    type: HomeGadgetType;

    @IsNotEmpty()
    @IsString()
    apiUrls: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    swiperBannersCount?: number;

    // optional title to be used for 
    // gadgets with 'TITLE AS TEXT'
    @IsOptional()
    @IsString()
    title?: string;

    // when type is POPULAR
    @IsOptional()
    @IsString()
    brandIds?: string;


    // when type is 
    // TWO_TO_THREE_PRODUCTS_IN_HORIZONTAL_WITH_TITLE_AS_TEXT
    @IsOptional()
    @IsString()
    productIds?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    queue: number = 1;

}