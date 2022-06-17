import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { BrandController } from './brand/brand.controller';
import { BrandModule } from './brand/brand.module';
import { BrandService } from './brand/brand.service';
import { CategoryController } from './category/category.controller';
import { CategoryModule } from './category/category.module';
import { CategoryService } from './category/category.service';
import { FilterController } from './filter/filter.controller';
import { FilterModule } from './filter/filter.module';
import { FilterService } from './filter/filter.service';
import { MarketController } from './market/market.controller';
import { MarketModule } from './market/market.module';
import { MarketService } from './market/market.service';
import { MenuCategoryModule } from './menu-category/menu-category.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductController } from './product/product.controller';
import { ProductModule } from './product/product.module';
import { ProductService } from './product/product.service';
import {
  ProductImagesController,
} from './product_images/product_images.controller';
import { ProductImagesModule } from './product_images/product_images.module';
import { ProductImagesService } from './product_images/product_images.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    MarketModule,
    CategoryModule,
    MenuCategoryModule,
    BrandModule,
    ProductModule,
    FilterModule,
    ProductImagesModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [
    AuthController,
    UserController,
    MarketController,
    CategoryController,
    ProductController,
    BrandController,
    FilterController,
    ProductImagesController
  ],
  providers: [
    AuthService,
    UserService,
    MarketService,
    CategoryService,
    BrandService,
    ProductService,
    FilterService,
    ProductImagesService,
    JwtService
  ],
})

export class AppModule {}
