import { Body, ClassSerializerInterceptor, Controller, Get, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiResponse } from "src/shared/dto/api_response.dto";
import { CreateHomeGadget } from "./dto/gadgets.dto";
import { GadgetService } from "./gadget.service";

@UseInterceptors(ClassSerializerInterceptor)
@Controller('gadgets')
export class GadgetController {
  constructor(private gadgetService: GadgetService) { }

  @Get('')
  async getGadgets() {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.gadgetService.getGadgets();
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


  @Post('create/home')
  @UseInterceptors(FilesInterceptor('files'))
  async createGadgetForHome(@UploadedFiles() files: Array<Express.Multer.File>, @Body() dto: CreateHomeGadget,) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.gadgetService.createGadgetForHome(files, dto);
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