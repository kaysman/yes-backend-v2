import { PrismaService } from 'src/prisma/prisma.service';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateFilterDTO } from './dto/create-filter.dto';

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

  async getFilterById(filterId: number) {
    try {
      var getFilter = await this.prisma.filter.findUnique({
        where: { id: filterId },
      });
      if (getFilter) {
        return getFilter;
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
