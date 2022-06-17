import { ApiResponse } from 'src/shared/dto/api_response.dto';
import { writeFileFromBase64 } from 'src/shared/helper';

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UploadImageDTO } from './dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { GetUserByPhoneNumberDTO } from './dto/get-user-phone.dto';
import { UserService } from './user.service';

@UseInterceptors(AuthGuard('jwt'))
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('create')
  async createUser(@Body() dto: CreateUserDTO) {
    return await this.userService.createUser(dto);
  }

  @Get()
  async getUserByphone(@Body() dto: GetUserByPhoneNumberDTO){
    return await this.userService.getUserByPhoneNumber(dto)
  }

  @Get('/:id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.userService.getUserById(id);
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

  @Post('upload/image')
  async uploadImage65(@Body() dto: UploadImageDTO){    
    return writeFileFromBase64(dto.image, 'photo');
  }
}
