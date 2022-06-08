import { ApiResponse } from 'src/shared/dto/api_response.dto';

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { BrandService } from './brand.service';
import { CreateBrandDTO } from './dto/create-brand.dto';

@Controller('brands')
export class BrandController {
  constructor(private brandService: BrandService) {}

  @Get('all')
  async getBrands() {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.brandService.getAllBrands();
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
  async getBrandById (@Param('id',ParseIntPipe) brandId: number){
    var apiResponse = new ApiResponse();
    try {
      var res = await this.brandService.getBrandById(brandId);
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
  async createBrand(@Body() dto: CreateBrandDTO) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.brandService.createBrand(dto);
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
