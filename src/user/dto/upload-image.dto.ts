import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class UploadImageDTO{

    @IsNotEmpty()
    @IsString()
    image : string
}