import { ApiResponse } from 'src/shared/dto/api_response.dto';
import { PaginationDTO } from 'src/shared/dto/pagination.dto';

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';

import { CreateFilterDTO } from './dto/create-filter.dto';
import { FilterService } from './filter.service';

@Controller('filters')
export class FilterController {
  constructor(private filterService: FilterService) {}

  @Get('')
  async getFilters(@Query() dto: PaginationDTO) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.filterService.getFilters(dto);
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
  async getFilterById(@Param('id', ParseIntPipe) filterId: number) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.filterService.getFilterById(filterId);
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
  async createFilter(@Body() dto: CreateFilterDTO) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.filterService.createFilter(dto);
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
