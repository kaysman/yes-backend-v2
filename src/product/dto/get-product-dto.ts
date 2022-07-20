import { Brand, Category, Filter, Market, Product_Images } from "@prisma/client";

export class GetProductDTO {
    name_tm: string;
    name_ru: string;
    ourPrice: number;
    marketPrice: number;
    color: Filter;
    gender: Filter;
    sizes: Filter[];
    code: string;
    description_tm: string;
    description_ru: string;
    brand: Brand;
    category: Category;
    market: Market;
    images: Product_Images[];
    createdAt: Date;
    updatedAt: Date;
}