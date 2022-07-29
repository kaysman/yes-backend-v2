import { Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { OrderService } from "./order.service";

@Controller('orders')
export class OrderController {
    constructor (private orderService: OrderService) {}

    @Get('')
    async getOrders() {return 'aaa'}

    @Get(':id')
    async getOrderById(@Param('id', ParseIntPipe) id: number) {}

    @Post('create')
    async createOrder(){}

    @Patch('update')
    async updateOrder() {}

    @Delete(':id')
    async deleteOrder() {}

}