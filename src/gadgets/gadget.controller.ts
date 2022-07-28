import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiResponse } from "src/shared/dto/api_response.dto";
import { CreateGadget } from "./dto/create-gadget.dto";
import { GetGadgetQuery } from "./dto/get-gadget.dto";
import { UpdateGadgetDTO } from "./dto/update-gadget.dto";
import { GadgetService } from "./gadget.service";

@UseInterceptors(ClassSerializerInterceptor)
@Controller('gadgets')
export class GadgetController {
  constructor(private gadgetService: GadgetService) { }

  @Get(':id')
  async getGadgetById(@Param('id', ParseIntPipe) id: number) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.gadgetService.getGadgetById(id);
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

  @Get()
  async getGadgets(@Query() param: GetGadgetQuery) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.gadgetService.getGadgets(param);
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
  @UseInterceptors(FilesInterceptor('images'))
  async createGadget(
    @UploadedFiles() files: Array<Express.Multer.File>, 
    @Body() dto: CreateGadget,
  ) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.gadgetService.createGadget(files, dto);
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
  async updateGadget(@Body() dto: UpdateGadgetDTO) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.gadgetService.updateGadget(dto);
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
  async deleteGadget(@Param('id', ParseIntPipe) id : number) {
    var apiResponse = new ApiResponse();
    try {
      var res = await this.gadgetService.deleteGadget(id);
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