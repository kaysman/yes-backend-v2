import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiResponse } from 'src/shared/dto/api_response.dto';
import { AddressService } from './address.service';
import { CreateAddressDTO } from './dto/create-address.dto';

@Controller('addresses')
export class AddressController {
    constructor(private addressService: AddressService) { }

    @Get()
    async getAddresses() {
        var apiResponse = new ApiResponse();
        try {
            var res = await this.addressService.getAddresses();
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
    async getAddressById() { }

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
