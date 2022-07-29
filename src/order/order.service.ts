import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateOrderDTO, CreateOrderItem } from "./dto/create-order.dto";

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(dto: CreateOrderDTO) {
    try {
      var prdts = JSON.parse(dto.products.toString()) as CreateOrderItem[]
      var data = prdts.map(e => { return {productId: e.productId, quantity: e.quantity, sizeId: e.size_id} })
      var res = await this.prisma.order.create({
        data: {
          addressId: dto.addressId,
          note: dto.note,
          userId: dto.userId,
          products: {create: data}
        }
      });
    } catch (error) {
      throw error
    }
  }

}