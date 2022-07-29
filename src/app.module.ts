import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';

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
import { GadgetModule } from './gadgets/gadget.module';
// import { GadgetModule } from './gadgets/gadget.module';
import { MarketController } from './market/market.controller';
import { MarketModule } from './market/market.module';
import { MarketService } from './market/market.service';
import { OrderController } from './order/order.controller';
import { OrderModule } from './order/order.module';
import { OrderService } from './order/order.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductController } from './product/product.controller';
import { ProductModule } from './product/product.module';
import { ProductService } from './product/product.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { AddressModule } from './address/address.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    MarketModule,
    CategoryModule,
    BrandModule,
    ProductModule,
    OrderModule,
    FilterModule,
    ConfigModule.forRoot({ isGlobal: true }),
    GadgetModule,
    MulterModule.register(),
    AddressModule,
    
  ],
  controllers: [
    AuthController,
    UserController,
    MarketController,
    CategoryController,
    ProductController,
    BrandController,
    FilterController,
    OrderController,
  ],
  providers: [
    AuthService,
    UserService,
    MarketService,
    CategoryService,
    BrandService,
    ProductService,
    FilterService,
    JwtService,
    OrderService,
  ],
})

export class AppModule {}
