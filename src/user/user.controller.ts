import { writeFileFromBase64 } from 'src/shared/helper';

import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import { UploadImageDTO } from './dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { GetUserByPhoneNumberDTO } from './dto/get-user-phone.dto';
import { UserService } from './user.service';

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

  @Post('upload/image')
  async uploadImage65(@Body() dto: UploadImageDTO){
    
    return writeFileFromBase64(dto.image, 'photo');
  }
}
