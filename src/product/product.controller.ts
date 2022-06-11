import { ApiResponse } from 'src/shared/dto/api_response.dto';

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';

import { CreateProductDTO } from './dto/create-product.dto';
import { FilterForProductDTO } from './dto/filter-for-product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('all')
  async getProducts() {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.productService.getAllProducts();
      apiResponse.responseCode = 200;
      apiResponse.data = res;
      apiResponse.message = '';
    } catch (error) {
      apiResponse.responseCode = error.responseCode;
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
      apiResponse.data = res;
      apiResponse.message = '';
    } catch (error) {
      apiResponse.responseCode = error.responseCode;
      apiResponse.message = error.toString();
    } finally {
      return apiResponse;
    }
  }

  @Get('market/:id')
  async getMarketProducts(
    @Param('id', ParseIntPipe) marketId: number,
    @Query() dto: FilterForProductDTO,
  ) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.productService.getMarketProducts(marketId, dto);
      apiResponse.responseCode = 200;
      apiResponse.data = res;
      apiResponse.message = '';
    } catch (error) {
      apiResponse.responseCode = error.responseCode;
      apiResponse.message = error.toString();
    } finally {
      return apiResponse;
    }
  }

  @Get('brand/:id')
  async getBrandProducts(
    @Param('id', ParseIntPipe) brandId: number,
    @Query() dto: FilterForProductDTO,
  ) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.productService.getBrandProducts(brandId, dto);
      apiResponse.responseCode = 200;
      apiResponse.data = res;
      apiResponse.message = '';
    } catch (error) {
      apiResponse.responseCode = error.responseCode;
      apiResponse.message = error.toString();
    } finally {
      return apiResponse;
    }
  }

  @Get('category/:id')
  async getCategoryProducts(
    @Param('id', ParseIntPipe) categoryId: number,
    @Query() dto: FilterForProductDTO,
  ) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.productService.getCategoryProducts(categoryId, dto);
      apiResponse.responseCode = 200;
      apiResponse.data = res;
      apiResponse.message = '';
    } catch (error) {
      apiResponse.responseCode = error.responseCode;
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
      apiResponse.data = res;
      apiResponse.message = '';
    } catch (error) {
      apiResponse.responseCode = error.responseCode;
      apiResponse.message = error.toString();
    } finally {
      return apiResponse;
    }
  }
}
