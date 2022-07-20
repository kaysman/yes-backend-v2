import { ApiResponse } from 'src/shared/dto/api_response.dto';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { CreateProductDTO } from './dto/create-product.dto';
import { FilterForProductDTO } from './dto/filter-for-product.dto';
import { ProductService } from './product.service';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/shared/helper';
import { UpdateProductDTO } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) { }

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
  @UseInterceptors(FilesInterceptor('images', 10, {
    fileFilter: imageFileFilter,
  }))
  async createProduct(@Body() dto: CreateProductDTO, @UploadedFiles() files: Express.Multer.File[]) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.productService.createProduct(files, dto);
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
  async uploadExcel(@Request() req: any, @UploadedFile() file: Express.Multer.File,) {
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

  @Patch('update')
  async updateProduct(@Body() dto: UpdateProductDTO) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.productService.updateProduct(dto);
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

  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.productService.deleteProduct(id);
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
