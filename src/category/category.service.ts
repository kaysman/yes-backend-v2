import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDTO } from 'src/shared/dto/pagination.dto';

import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category } from '@prisma/client';

import { CreateCategoryDTO } from './dto/create-category.dto';
import { UpdateCategoryDTO } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getCategories(dto: PaginationDTO) {
    try {
      let { take, search, lastId: cursor } = dto;
      var categories: Category[];

      if (search) {
        categories = await this.searchCategory(search, take, cursor);
      } else {
        categories = await this.prisma.category.findMany({
          where: {parentId: null},
          include: { subcategories: true },
        });
      }

      return categories;
    } catch (error) {
      throw error;
    }
  }

  async searchCategory(query: string, take: number, cursor?: number) {
    try {
      return await this.prisma.category.findMany({
        take: take,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          OR: [
            {
              title_tm: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              title_ru: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              description_tm: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              description_ru: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
        include: { subcategories: true },
      });
    } catch (error) {}
  }

  async getCategoryById(categoryId: number) {
    try {
      var getCategory = await this.prisma.category.findUnique({
        where: { id: categoryId },
        include: { subcategories: true, products: true },
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
            parentId: dto.parentId,
          },
          include: { subcategories: true },
        });
        return newCategory;
      } else {
        throw new Error("category already exists");
      }
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(dto: UpdateCategoryDTO) {
    try {

      let {
        id,
        title_tm,
        title_ru,
        description_tm,
        description_ru,
        parentId
      } = dto
      
      var category = await this.prisma.category.findFirst({
        where: {id: id},
      });

      if (category) {
        
        if (!category.parentId && parentId) {
          /// if it has no parentId, it is parent (main category). 
          /// So let's not allow parents to update main categories for now.
          /// To allow it, we have to ask where to 
          /// transfer this categories' products.
          throw new BadRequestException("This feature is not available right now. Feature to be released soon.");
        }

        var updated = await this.prisma.category.update({
          where: {id: id},
          data: {
            title_tm: title_tm,
            title_ru: title_ru,
            description_ru: description_ru,
            description_tm: description_tm,
            parentId: parentId,
          },
          include: { subcategories: true },
        });
        return updated;
      } else {
        throw new NotFoundException();
      }

    } catch (error) {
      throw error;
    }
  }


  async deleteCategory(id: number) {
    try {
      var category = await this.prisma.category.findFirst({
        where: {id: id},
      });
      if (category) {

        if (!category.parentId){
          await this.prisma.category.deleteMany({where: {parentId: category.id}});
        }

        var res = await this.prisma.category.delete({where: {id: id}});
        return true;
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      throw error;
    }
  }
}
