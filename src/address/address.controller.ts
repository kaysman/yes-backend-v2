import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseInterceptors } from '@nestjs/common';
import { ApiResponse } from 'src/shared/dto/api_response.dto';
import { AddressService } from './address.service';
import { CreateAddressDTO } from './dto/create-address.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('addresses')
// @UseInterceptors(AuthGuard('jwt'))
export class AddressController {
    constructor(private addressService: AddressService) { }

    @Get()
    async getAddresses(@Req() req: any) {
        var apiResponse = new ApiResponse();
        try {
            var res = await this.addressService.getUserAddresses(1);
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

    @Get(':id')
    async getAddressById(@Param('id', ParseIntPipe) id : number) { 
        var apiResponse = new ApiResponse();
        try {
            var res = await this.addressService.getAddressById(id);
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
    async createAddress(@Body() dto: CreateAddressDTO) {
        var apiResponse = new ApiResponse();
        try {
            var res = await this.addressService.createAddress(dto);
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

    @Patch('update')
    async updateAddress() { }

    @Delete(':id')
    async deleteAddress() { }
}
