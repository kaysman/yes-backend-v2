import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDTO } from 'src/shared/dto/pagination.dto';
import {
  deleteFile,
  editFileName,
  getImagePath,
  publicFilePath,
  saveFile,
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
       for (let brand of brands){
        brand.logo = publicFilePath(brand.logo);
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
        getBrand.logo = publicFilePath(getBrand.logo);
        return getBrand;
      } else return new NotFoundException('Brand cannot be found');
    } catch (error) {
      throw error;
    }
  }

  async createBrand(dto: CreateBrandDTO, file: Express.Multer.File) {
    try {
      if (!await this.prisma.brand.findFirst({
        where: {name: dto.name},
      })) {
        var filename = editFileName(file);
        await saveFile(filename, file.buffer);
        var newBrand = await this.prisma.brand.create({
          data: {
            name: dto.name,
            logo: filename,
            vip: Boolean(dto.vip)
          },
        });
        return newBrand;
      } else return new BadRequestException('brand already exists');
    } catch (error) {
      throw error;
    }
  }

  async updateBrand(file: Express.Multer.File, dto: UpdateBrandDTO) {
    try {
      var old = await this.prisma.brand.findFirst({ where: { id: dto.id } });
      if (old) {
        if (file) {
          // create new image
          var filename = editFileName(file)
          await saveFile(filename, file.buffer);
          // if success, remove old image
          await deleteFile(old.logo);
        }
        var brand = await this.prisma.brand.update({
          where: { id: dto.id },
          data: {
            name: dto.name,
            vip: dto.vip,
            logo: filename,
          },
        });
        
        return brand;
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteBrand(id: number) {
    try {
      if (await this.prisma.brand.findFirst({ where: { id: id } })) {
        var res = await this.prisma.brand.delete({where: {id: id}});
        await deleteFile(res.logo);
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      throw error;
    }
  }
}
