import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export  class UploadExcelDTO {
    @IsNotEmpty()
    @IsString()
    excelBase64String: string;
}