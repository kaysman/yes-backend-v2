import { GadgetLocation, Product, STATUS } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";
import { CreateGadgetCategory } from "./create-gadget.dto";

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
    subcategories: CreateGadgetCategory[];
    image: string
}