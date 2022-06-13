import { PrismaService } from 'src/prisma/prisma.service';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateFilterDTO } from './dto/create-filter.dto';
import { GetFilterDTO } from './dto/get-filter-dto';

@Injectable()
export class FilterService {
  constructor(private prisma: PrismaService) {}

  async getAllFilters() {
    try {
      var allFilters = await this.prisma.filter.findMany();
      return allFilters;
    } catch (error) {
      throw error;
    }
  }

  async searchFilter(query: string) {
    try {
      return await this.prisma.filter.findMany({
        where: {
          OR: [
            {
              name_tm: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              name_ru: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getFilterById(filterId: number) {
    try {
      var getFilter = await this.prisma.filter.findUnique({
        where: { id: filterId }
      });
      if (getFilter) {
        let allProducts = [];
        var productsFromColorAndGender = await this.prisma.product.findMany({
          where: {
            OR: [
              {
                color_id: filterId
              },
              {
                gender_id: filterId,
              }
            ],
          }
        });

        var productsFromSize = await this.prisma.filter_Product.findMany({
          where: {
            size_id: filterId
          }, include: {product: true}
        });

        allProducts.concat(productsFromColorAndGender);
        allProducts.concat(productsFromSize);
        
        
        let { name_tm, name_ru, type} = getFilter;
        var filter = new GetFilterDTO();
        filter.name_ru = name_ru;
        filter.name_tm = name_tm;
        filter.type = type;
        filter.products = allProducts;

        return filter;

      } else return new NotFoundException('filter cannot be found');
    } catch (error) {
      throw error;
    }
  }

  async createFilter(dto: CreateFilterDTO) {
    try {
      var checkFilter = await this.prisma.filter.findFirst({
        where: {
          name_tm: dto.name_tm,
        },
      });
      if (!checkFilter) {
        var newFilter = await this.prisma.filter.create({
          data: {
            ...dto,
          },
        });
        return newFilter;
      } else return new BadRequestException('this filter already exists');
    } catch (error) {
      throw error;
    }
  }
}
