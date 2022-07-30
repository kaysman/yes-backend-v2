import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ApiResponse } from "src/shared/dto/api_response.dto";
import { CreateOrderDTO } from "./dto/create-order.dto";
import { UpdateOrderDTO } from "./dto/update-order.dto";
import { OrderService } from "./order.service";

@Controller('orders')
export class OrderController {
    constructor(private orderService: OrderService) { }

    @Get()
    async getOrders() { 
        var apiResponse = new ApiResponse();
        try {
            var res = await this.orderService.getOrders();
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
    async getOrderById(@Param('id', ParseIntPipe) id: number) { }

    @Post('create')
    async createOrder(@Body() dto: CreateOrderDTO) {
        var apiResponse = new ApiResponse();
        try {
            var res = await this.orderService.createOrder(dto);
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

    @Patch('update')
    async updateOrder(@Body() dto: UpdateOrderDTO) {
        
     }

    @Delete(':id')
    async deleteOrder() { }

}