import { ApiResponse } from 'src/shared/dto/api_response.dto';
import { PaginationDTO } from 'src/shared/dto/pagination.dto';

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
} from '@nestjs/common';

import { CreateMarketDTO } from './dto/create-market.dto';
import { UpdateMarketDTO } from './dto/update-market.dto';
import { MarketService } from './market.service';

@Controller('markets')
export class MarketController {
  constructor(private markerService: MarketService) {}

  @Get('')
  async getMarkets(@Query() dto: PaginationDTO) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.markerService.getMarkets(dto);
      apiResponse.responseCode = 200;
      apiResponse.success = true;
      apiResponse.data = res;
      apiResponse.message = '';
    } catch (error) {
      apiResponse.success = false;
      apiResponse.responseCode = error.responseCode;
      apiResponse.message = error.toString();
    } finally {
      return apiResponse;
    }
  }

  @Get(':id')
  async getMarketById(@Param('id', ParseIntPipe) marketId: number) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.markerService.getMarketById(marketId);
      apiResponse.success = true;
      apiResponse.responseCode = 200;
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
  async createMarket(@Request() req: any, @Body() dto: CreateMarketDTO) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.markerService.createMarket(dto);
      apiResponse.success = true;
      apiResponse.responseCode = 200;
      apiResponse.data = res;
      apiResponse.message = '';
    } catch (error) {
      apiResponse.success = false;
      apiResponse.responseCode = error.responseCode;
      apiResponse.message = error.toString();
    } finally {
      return apiResponse;
    }
  }

  @Patch('update')
  async updateMarket(@Body() dto: UpdateMarketDTO) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.markerService.updateMarket(dto);
      apiResponse.success = true;
      apiResponse.responseCode = 200;
      apiResponse.data = res;
      apiResponse.message = `Market with id ${dto.id} updated successfully`;
    } catch (error) {
      apiResponse.success = false;
      apiResponse.responseCode = error.responseCode;
      apiResponse.message = error?.toString();
    } finally {
      return apiResponse;
    } 
  }

  @Delete(':id')
  async deleteMarket(@Param('id', ParseIntPipe) id: number) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.markerService.deleteMarket(id);
      apiResponse.success = true;
      apiResponse.responseCode = 200;
      apiResponse.data = res;
      apiResponse.message = `Market with id ${id} deleted.`;
    } catch (error) {
      apiResponse.success = false;
      apiResponse.responseCode = error.responseCode;
      apiResponse.message = error?.toString();
    } finally {
      return apiResponse;
    }
  }
}
