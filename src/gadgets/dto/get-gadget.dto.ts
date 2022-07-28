import { GadgetLocation, Product, STATUS } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";
import { GadgetType } from "src/shared/enums/home_gadget.enum";
import { CreateGadgetSubCategory } from "./create-gadget.dto";

export class GetGadgetQuery {
    @IsOptional()
    @IsEnum(GadgetLocation)
    tab: GadgetLocation

    @IsOptional()
    @IsEnum(STATUS)
    status: STATUS
}

export class GetGadgetDTO {
    title: string
    type: string
    items: GetGadgetLinkImage[]
    products: Product[]
    queue: number
    status: STATUS
    location: GadgetLocation
}

export class GetGadgetLinkImage {
    link: string
    subcategories: CreateGadgetSubCategory[];
    image: string
}