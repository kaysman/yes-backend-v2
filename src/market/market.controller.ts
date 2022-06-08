import { ApiResponse } from 'src/shared/dto/api_response.dto';

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { CreateMarketDTO } from './dto/create-market.dto';
import { MarketService } from './market.service';

@Controller('markets')
export class MarketController {
  constructor(private markerService: MarketService) {}

  @Get('all')
  async getMarkets() {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.markerService.getAllMarkets();
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
  async getMarketById(@Param('id', ParseIntPipe) marketId: number) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.markerService.getMarketById(marketId);
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
  async createMarket(@Body() dto: CreateMarketDTO) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.markerService.createMarket(dto);
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
