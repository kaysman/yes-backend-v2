import { ApiResponse } from 'src/shared/dto/api_response.dto';

import {
  Body,
  Controller,
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

  @Get('all')
  async getMarkets() {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.markerService.getAllMarkets();
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

  @Get('')
  async searchMarket(@Query() search) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.markerService.searchMarket(search.search);
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

  @Patch('update/:id')
  async updateMarket(
    @Body() dto: UpdateMarketDTO,
    @Param('id', ParseIntPipe) marketId: number,
  ) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.markerService.updateMarket(marketId, dto);
      apiResponse.success = true;
      apiResponse.responseCode = 200;
      apiResponse.data = res;
      apiResponse.message = 'Market with id(' + marketId + ') updated successfully';
    } catch (error) {
      apiResponse.success = false;
      apiResponse.responseCode = error.responseCode;
      apiResponse.message = error?.toString();
    }
    return apiResponse;
  }
}
