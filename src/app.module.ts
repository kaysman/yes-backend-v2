import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { BrandController } from './brand/brand.controller';
import { BrandModule } from './brand/brand.module';
import { BrandService } from './brand/brand.service';
import { CategoryModule } from './category/category.module';
import { FilterController } from './filter/filter.controller';
import { FilterModule } from './filter/filter.module';
import { FilterService } from './filter/filter.service';
import { MarketController } from './market/market.controller';
import { MarketModule } from './market/market.module';
import { MarketService } from './market/market.service';
import { MenuCategoryModule } from './menu-category/menu-category.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';

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
  ],
  controllers: [
    UserController,
    MarketController,
    BrandController,
    FilterController,
  ],
  providers: [MarketService, BrandService,FilterService],
})
export class AppModule {}
