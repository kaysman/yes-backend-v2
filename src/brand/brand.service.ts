import { PrismaService } from 'src/prisma/prisma.service';
import {
  getImagePath,
  writeWebpFile,
} from 'src/shared/helper';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateBrandDTO } from './dto/create-brand.dto';

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService) {}

  async getAllBrands() {
    try {
      var allBrands = await this.prisma.brand.findMany();
      return allBrands;
    } catch (error) {
      throw error;
    }
  }

  async getBrandById(brandId: number) {
    try {
      var getBrand = await this.prisma.brand.findUnique({
        where: { id: brandId },
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

        if (dto.image) {
          var brandName = dto.name;
          await writeWebpFile(dto.image, brandName);
        }
        newBrand.image = getImagePath(brandName);
        return newBrand;
      } else return new BadRequestException('brand already exists');
    } catch (error) {
      throw error;
    }
  }
}
