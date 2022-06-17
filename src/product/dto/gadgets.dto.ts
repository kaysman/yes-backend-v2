import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Validate } from "class-validator";
import { HomeGadgetType } from "src/shared/enums/home_gadget.enum";

export class CreateHomeGadget {

    @IsNotEmpty()
    @IsEnum(HomeGadgetType)
    type : HomeGadgetType;

    @IsNotEmpty()
    @IsArray({each: true})
    apiUrls: string[];

    @IsOptional()
    @IsNumber()
    swiperBannersCount?: number;

    // optional title to be used for 
    // gadgets with 'TITLE AS TEXT'
    @IsString()
    @IsOptional()
    title?: string;

    // when type is POPULAR
    @IsNotEmpty()
    @IsArray({each: true})
    brandIds: string[];


    // when type is 
    // TWO_TO_THREE_PRODUCTS_IN_HORIZONTAL_WITH_TITLE_AS_TEXT
    @IsNotEmpty()
    @IsArray({each: true})
    productIds: string[];

}