import { Body, ClassSerializerInterceptor, Controller, Get, Post, UseInterceptors } from "@nestjs/common";
import { ApiResponse } from "src/shared/dto/api_response.dto";
import { CreateHomeGadget } from "./dto/gadgets.dto";
import { GadgetService } from "./gadget.service";

@UseInterceptors(ClassSerializerInterceptor)
@Controller('gadgets')
export class GadgetController {
    constructor (private gadgetService: GadgetService) {}

    @Get('home')
    async getHomeGadgets() {}
    
    
    @Post('create/home')
    async createGadgetForHome(@Body() dto: CreateHomeGadget) {
        var apiResponse = new ApiResponse();
        try {
          var res = await this.gadgetService.createGadgetForHome(dto);
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