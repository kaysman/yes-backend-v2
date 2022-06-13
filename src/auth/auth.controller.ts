import { ApiResponse } from 'src/shared/dto/api_response.dto';
import {
  CreateUserDTO,
  LoginDTO,
} from 'src/user/dto';

import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDTO: CreateUserDTO) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.authService.signup(signupDTO);
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

  @Post('signin')
  async signin(@Body() loginDto: LoginDTO) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.authService.signin(loginDto);
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
}
