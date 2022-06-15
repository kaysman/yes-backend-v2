import { ApiResponse } from 'src/shared/dto/api_response.dto';
import { PaginationDTO } from 'src/shared/dto/pagination.dto';

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { BrandService } from './brand.service';
import { CreateBrandDTO } from './dto/create-brand.dto';
import { UpdateBrandDTO } from './dto/update-brand.dto';

@Controller('brands')
export class BrandController {
  constructor(private brandService: BrandService) {}

  @Get('')
  async getBrands(@Query() dto: PaginationDTO) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.brandService.getBrands(dto);
      apiResponse.responseCode = 200;
      apiResponse.data = res;
      apiResponse.success = true;
      apiResponse.message = res.length + ' brands found';
    } catch (error) {
      apiResponse.responseCode = error.responseCode;
      apiResponse.success = false;
      apiResponse.message = error.toString();
    } finally {
      return apiResponse;
    }
  }

  @Get(':id')
  async getBrandById(@Param('id', ParseIntPipe) brandId: number) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.brandService.getBrandById(brandId);
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
  async createBrand(@Body() dto: CreateBrandDTO) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.brandService.createBrand(dto);
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

  @Patch('update/:id')
  async updateBrand(
    @Body() dto: UpdateBrandDTO,
    @Param('id', ParseIntPipe) id: number,
  ) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.brandService.updateBrand(id, dto);
      apiResponse.responseCode = 200;
      apiResponse.success = true;
      apiResponse.data = res;
      apiResponse.message = 'Brand id:' + id + ' updated';
    } catch (error) {
      apiResponse.responseCode = error.responseCode;
      apiResponse.success = false;
      apiResponse.message = error.toString();
    } finally {
      return apiResponse;
    }
  }
}
