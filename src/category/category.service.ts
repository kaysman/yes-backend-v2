import { PrismaService } from 'src/prisma/prisma.service';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateCategoryDTO } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getAllCategories() {
    try {
      var allCategories = await this.prisma.category.findMany();
      return allCategories;
    } catch (error) {
      throw error;
    }
  }

  async getCategoryById(categoryId: number) {
    try {
      var getCategory = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (getCategory) {
        return getCategory;
      } else return new NotFoundException('category cannot be found');
    } catch (error) {
      throw error;
    }
  }

  async createCategory(dto: CreateCategoryDTO) {
    try {
      var checkCategory = await this.prisma.category.findFirst({
        where: {
          title_tm: dto.title_tm,
        },
      });
      if (!checkCategory) {
        var newCategory = await this.prisma.category.create({
          data: {
            title_tm: dto.title_tm,
            title_ru: dto.title_ru,
            description_ru: dto.description_ru,
            description_tm: dto.description_tm,
            parentId: Number(dto.parentId),
          },
        });
        return newCategory;
      } else {
        throw new BadRequestException();
      }
    } catch (error) {
      throw error;
    }
  }
}
