import { PrismaService } from 'src/prisma/prisma.service';
import {
  getImagePath,
  writeFileFromBase64,
} from 'src/shared/helper';

import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { CreateProductImageDTO } from './dto/create-ProductImage.dto';

@Injectable()
export class ProductImagesService {
  constructor(private prisma: PrismaService) {}

  async createProductImage(dto: CreateProductImageDTO) {
    try {
      var checkProduct = await this.prisma.product.findFirst({
        where: { id: dto.productId },
      });
      if (checkProduct) {
        var newProductImage = await this.prisma.product_Images.create({
          data: dto,
          
        });
        await writeFileFromBase64(dto.image, checkProduct.name_tm);
        newProductImage.image = getImagePath(checkProduct.name_tm);
      } else return new BadRequestException("product does not exits")

      return newProductImage;
    } catch (error) {
      throw error;
    }
  }
}
