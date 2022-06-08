import { Module } from '@nestjs/common';
import { MenuCategoryService } from './menu-category.service';
import { MenuCategoryController } from './menu-category.controller';

@Module({
  providers: [MenuCategoryService],
  controllers: [MenuCategoryController]
})
export class MenuCategoryModule {}
