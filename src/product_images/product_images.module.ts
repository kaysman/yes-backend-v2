import { ProductModule } from 'src/product/product.module';

import { Module } from '@nestjs/common';

import { ProductImagesController } from './product_images.controller';
import { ProductImagesService } from './product_images.service';

@Module({
  providers: [ProductImagesService],
  controllers: [ProductImagesController],
  imports:[ProductModule]
})
export class ProductImagesModule {}
