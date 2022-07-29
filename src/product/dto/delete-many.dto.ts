import { IsNotEmpty, IsString } from "class-validator";

export class DeleteManyProductsDTO {
    @IsString()
    @IsNotEmpty()
    ids: number[]
}