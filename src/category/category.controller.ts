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
} from '@nestjs/common';

import { CategoryService } from './category.service';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { UpdateCategoryDTO } from './dto/update-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('')
  async getCategories(@Query() dto: PaginationDTO) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.categoryService.getCategories(dto);
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
  async getCategoryById(@Param('id', ParseIntPipe) categoryId: number) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.categoryService.getCategoryById(categoryId);
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
  async createCategory(@Body() dto: CreateCategoryDTO) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.categoryService.createCategory(dto);
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

  @Patch('update')
  async updateCategory(@Body() dto: UpdateCategoryDTO) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.categoryService.updateCategory(dto);
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
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.categoryService.deleteCategory(id);
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
