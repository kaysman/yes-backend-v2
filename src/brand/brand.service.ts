import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDTO } from 'src/shared/dto/pagination.dto';
import {
  getImagePath,
  writeFileFromBase64,
} from 'src/shared/helper';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateBrandDTO } from './dto/create-brand.dto';
import { UpdateBrandDTO } from './dto/update-brand.dto';

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService) {}

  async getBrands(dto: PaginationDTO) {
    try {
      let { take, search, lastId: cursor } = dto;
      var brands;
      if (search) {
        brands = await this.searchBrand(search, take, cursor);
       } else {
        brands = await this.prisma.brand.findMany({
           take,
           cursor: cursor ? { id: cursor } : undefined,
         });
       }
      return brands;
    } catch (error) {
      throw error;
    }
  }

  async searchBrand(query: string, take: number, cursor?: number) {
    try {
      var brands = await this.prisma.brand.findMany({
        take: take,
        cursor: cursor ? {id: cursor} : undefined,
        where: {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
      });
      return brands;
    } catch (error) {
      throw error;
    }
  }

  async getBrandById(brandId: number) {
    try {
      var getBrand = await this.prisma.brand.findUnique({
        where: { id: brandId }, include: {products: true},
       });
      if (getBrand) {
        return getBrand;
      } else return new NotFoundException('Brand cannot be found');
    } catch (error) {
      throw error;
    }
  }

  async createBrand(dto: CreateBrandDTO) {
    try {
      var checkBrand = await this.prisma.brand.findFirst({
        where: {
          name: dto.name,
        },
      });
      if (!checkBrand) {
        var newBrand = await this.prisma.brand.create({
          data: {
            name: dto.name,
            vip: Boolean(dto.vip),
            logo: dto.logo,
            image: dto.image,
          },
        });
        return newBrand;
      } else return new BadRequestException('brand already exists');
    } catch (error) {
      throw error;
    }
  }

  async updateBrand(id: number, dto: UpdateBrandDTO) {
    try {
      if (await this.prisma.brand.findFirst({ where: { id: id } })) {
        if (dto.logo) {
          let logoImageName = dto.name + '_logo';
          await writeFileFromBase64(dto.logo, logoImageName);
          dto.logo = getImagePath(logoImageName);
        }
        if (dto.image) {
          let imageName =  dto.name + '_image';
          await writeFileFromBase64(dto.image, imageName);
          dto.image = getImagePath(imageName);
        }
        var brand = await this.prisma.brand.update({
          where: { id: id },
          data: dto,
        });
        return brand;
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      throw error;
    }
  }
}
