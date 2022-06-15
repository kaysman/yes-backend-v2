import { ApiResponse } from 'src/shared/dto/api_response.dto';

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CreateProductDTO } from './dto/create-product.dto';
import { FilterForProductDTO } from './dto/filter-for-product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('')
  async getProducts(@Query() filter: FilterForProductDTO) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.productService.getAllProducts(filter);
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

  @Get(':id')
  async getProductById(@Param('id', ParseIntPipe) productId: number) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.productService.getProductById(productId);
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


  @Post('create')
  async createProduct(@Body() dto: CreateProductDTO) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.productService.createProduct(dto);
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

  @Post('uploadExcel')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.productService.uploadExcel(file);
      apiResponse.responseCode = 200;
      apiResponse.success = true;
      apiResponse.data = res;
      apiResponse.message = '';
    } catch (error) {
      apiResponse.responseCode = error.responseCode;
      apiResponse.success = false;
      apiResponse.message = error?.toString();
    } finally {
      return apiResponse;
    }
  }
}
