import { ApiResponse } from 'src/shared/dto/api_response.dto';

import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { CreateProductImageDTO } from './dto/create-ProductImage.dto';
import { ProductImagesService } from './product_images.service';

@Controller('products')
export class ProductImagesController {
  constructor(private productImagesService: ProductImagesService) {}

  @Post('create/images')
  async createProductImage(@Body() dto: CreateProductImageDTO) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.productImagesService.createProductImage(dto);
      apiResponse.responseCode = 200;
      apiResponse.success = true;
      apiResponse.data = res;
      apiResponse.message = '';
    } catch (error) {
      apiResponse.responseCode = error.responseCode;
      apiResponse.success = false;
      apiResponse.message = error.toString();
    } finally {
      return apiResponse;
    }
  }
}
