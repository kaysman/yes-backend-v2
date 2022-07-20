import { PrismaService } from 'src/prisma/prisma.service';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateProductDTO,
  SizeItemDTO,
} from './dto/create-product.dto';
import { FilterForProductDTO } from './dto/filter-for-product.dto';
import { GetProductDTO } from './dto/get-product-dto';
import { deleteFile, editFileName, publicFilePath, saveFile } from 'src/shared/helper';
import { RuleTester } from 'eslint';
import { UpdateProductDTO } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) { }

  async getAllProducts(dto: FilterForProductDTO) {
    try {
      let {
        priceFrom,
        priceTo,
        color_id,
        gender_id,
        brand_id,
        category_id,
        market_id,
        take,
        lastId,
        search,
      } = dto;

      if (search) {
        return await this.searchProducts(search, take, lastId);
      }

      var cursor = lastId ? { id: lastId } : undefined;
      var products = await this.prisma.product.findMany({
        take: take,
        cursor: cursor,
        where: {
          AND: [
            { color_id: color_id },
            { gender_id: gender_id },
            { brand_id: brand_id },
            { category_id: category_id },
            { market_id: market_id },
            {
              AND: [
                { ourPrice: { gte: priceFrom } },
                { ourPrice: { lt: priceTo } },
              ],
            },
          ],
        },
        include: {
          category: true,
          color: true,
          gender: true,
          brand: true,
          market: true,
          sizes: true,
        },
      });

      for (let product of products) {
        var image = await this.prisma.product_Images.findFirst({
          where: {
            productId: product.id,
          }
        })
        product["images"] = [image]
      }

      return products;

    } catch (error) {
      throw error;
    }
  }

  private async searchProducts(query: string, take: number, cursor?: number) {
    try {
      var cursorObject = cursor ? { id: cursor } : undefined;
      return await this.prisma.product.findMany({
        take: take,
        cursor: cursorObject,
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
            {
              code: {
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
      });
    } catch (error) {
      throw error;
    }
  }

  async getProductById(productId: number) {
    try {
      var getProduct = await this.prisma.product.findUnique({
        where: { id: productId },
        include: {
          category: true,
          color: true,
          gender: true,
          brand: true,
          market: true,
          images: true,
          sizes: true,
        },
      });
      if (getProduct) {
        return getProduct;
      } else throw new NotFoundException();
    } catch (error) {
      throw error;
    }
  }

  async uploadExcel(file: Express.Multer.File) {
    try {
      const exceljs = require('exceljs');
      let buffer = file.buffer;

      var workbook = new exceljs.Workbook();
      var prismafilters = await this.prisma.filter.findMany();
      var prismaBrands = await this.prisma.brand.findMany();
      var prismacategories = await this.prisma.category.findMany();
      var prismaMarkets = await this.prisma.market.findMany();

      var dbColors = prismafilters
        .filter((element) => element.type === 'COLOR')
        .map((e) => e.id);
      var dbGenders = prismafilters
        .filter((element) => element.type === 'GENDER')
        .map((e) => e.id);
      var dbSizes = prismafilters
        .filter((element) => element.type === 'SIZE')
        .map((e) => e.id);
      var dbBrands = prismaBrands.map((e) => e.id);
      var dbSubCategories = prismacategories
        .filter((element) => element.parentId !== null)
        .map((e) => e.id);
      var dbMarkets = prismaMarkets.map((e) => e.id);

      await workbook.xlsx.load(buffer).then(() => {
        let worksheet = workbook.worksheets[1];

        // ------- colors -> 5th index -------------
        var colors = worksheet.getColumn(5).values;

        for (var i = 2; i <= colors.length - 1; i++) {
          if (!dbColors.includes(colors[i])) {
            throw new NotFoundException(
              'Color with id:' +
              colors[i] +
              ' at row:' +
              i +
              ' not found, please correct it and try again.',
            );
          }
        }
        // ----------------- end --------------------

        // ------- genders -> 6th index -------------
        var genders = worksheet.getColumn(6).values;

        for (var i = 2; i <= genders.length - 1; i++) {
          if (!dbGenders.includes(genders[i])) {
            throw new NotFoundException(
              'Gender with id:' +
              genders[i] +
              ' at row:' +
              i +
              ' not found, please correct it and try again.',
            );
          }
        }
        // ----------------- end --------------------

        // ------- sizes -> 14th index -------------
        var sizes = worksheet.getColumn(14).values;

        for (var i = 2; i <= sizes.length - 1; i++) {
          var cellValues = sizes[i].split(',');
          cellValues.forEach((value) => {
            if (!dbSizes.includes(Number(value.trim()))) {
              throw new NotFoundException(
                'Size with id:' +
                value.trim() +
                ' at row:' +
                i +
                ' not found, please correct it and try again.',
              );
            }
          });
        }
        // ----------------- end --------------------

        // ------- brand -> 11th index -------------
        var brands = worksheet.getColumn(11).values;

        for (var i = 2; i <= brands.length - 1; i++) {
          if (!dbBrands.includes(brands[i])) {
            throw new NotFoundException(
              'Brand with id:' +
              brands[i] +
              ' at row:' +
              i +
              ' not found, please correct it and try again.',
            );
          }
        }
        // ----------------- end --------------------

        // ------- category -> 12th index -------------
        var categories = worksheet.getColumn(12).values;

        for (var i = 2; i <= categories.length - 1; i++) {
          if (!dbSubCategories.includes(categories[i])) {
            throw new NotFoundException(
              'Category with id:' +
              categories[i] +
              ' at row:' +
              i +
              ' not found, make sure it is subcategory rather than main and try again.',
            );
          }
        }
        // ----------------- end --------------------

        // ------- market -> 13th index -------------
        var markets = worksheet.getColumn(13).values;

        for (var i = 2; i <= markets.length - 1; i++) {
          if (!dbMarkets.includes(markets[i])) {
            throw new NotFoundException(
              'Market with id:' +
              markets[i] +
              ' at row:' +
              i +
              ' not found, please correct it and try again.',
            );
          }
        }
        // ----------------- end --------------------


        for (const r of Array.from({ length: worksheet.rowCount - 1 }, (v, k) => k + 2)) {
          let row = worksheet.getRow(r);

          var product = new CreateProductDTO();
          product.name_tm = row.values[1].trim();
          product.name_ru = row.values[2].trim();
          product.ourPrice = Number(row.values[3]);
          product.marketPrice = Number(row.values[4]);
          product.color_id = Number(row.values[5]);
          product.gender_id = Number(row.values[6]);
          product.code = row.values[8].trim();
          product.description_tm = row.values[9].trim();
          product.description_ru = row.values[10].trim();
          product.brand_id = Number(row.values[11]);
          product.category_id = Number(row.values[12]);
          product.market_id = Number(row.values[13]);

          try {
            this.prisma.product.createMany({
              data: product
            }).then((v) => {
              console.log(v);
              console.log(worksheet.rowCount + " products created");
            });
          } catch (error) {
            console.log(error);
          }
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async createProduct(files: Express.Multer.File[], dto: CreateProductDTO) {
    try {
      var checkProduct = await this.prisma.product.findFirst({
        where: {
          code: dto.code,
        },
      });

      if (!checkProduct) {

        var parsedSizes = JSON.parse(dto.sizes.toString()) as Array<SizeItemDTO>;

        var newProduct = await this.prisma.product.create({
          data: {
            name_tm: dto.name_tm,
            name_ru: dto.name_ru,
            ourPrice: dto.ourPrice,
            marketPrice: dto.marketPrice,
            color_id: dto.color_id,
            gender_id: dto.gender_id,
            description_ru: dto.description_ru,
            description_tm: dto.description_tm,
            brand_id: dto.brand_id,
            market_id: dto.market_id,
            category_id: dto.category_id,
            code: dto.code,
          },
        });

        // TODO: Give 'totalQuantity' in response
        var countTotal = 0;
        var createdSizeIds = [];
        for (var i = 0; i < parsedSizes.length; i++) {
          countTotal += parsedSizes[i].count;
          var x = await this.prisma.product_Sizes.create({
            data: {
              size_id: parsedSizes[i].size_id,
              quantity: parsedSizes[i].count,
              product_id: newProduct.id,
            }
          });
          if (x) createdSizeIds.push(x.size_id);
        }

        for (let file of files) {
          var filename = editFileName(file)
          var res = await this.prisma.product_Images.create({
            data: {
              image: filename,
              productId: newProduct.id,
            }
          });
          if (res) {
            await saveFile(filename, file.buffer);
          }
        }

        return await this.getProductById(newProduct.id);
      } else return new BadRequestException('this product already exits');
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(dto: UpdateProductDTO) {
    try {

      let {
        id, 
        name_tm, 
        name_ru, 
        ourPrice, 
        marketPrice, 
        color_id, 
        gender_id, 
        description_tm, 
        description_ru, 
        brand_id, 
        category_id, 
        market_id, sizes,
      } = dto
      
      var getProduct = await this.prisma.product.findUnique({
        where: { id: id }
      });
      if (getProduct) {
        
        var res = await this.prisma.product.update({
          where: {id: id},
          data: {
            name_tm: name_tm,
            name_ru: name_ru,
            ourPrice: ourPrice,
            marketPrice: marketPrice,
            color_id: color_id,
            gender_id: gender_id,
            description_tm: description_tm,
            description_ru: description_ru,
            brand_id: brand_id,
            category_id: category_id,
            market_id: market_id,
          },
          include: {
            category: true,
            color: true,
            gender: true,
            brand: true,
            market: true,
            images: true,
            sizes: true,
          },
        });

        return res;
      } else throw new NotFoundException();


    } catch (error) {
      throw error;

    }
  }

  async deleteProduct(id: number) {
    try {
      var getProduct = await this.prisma.product.findUnique({
        where: { id: id }
      });
      if (getProduct) {
        var res = await this.prisma.product.delete({ where: { id: id }, include: { images: true } });
        for (let image of res.images) {
          await deleteFile(image.image);
        }
        return true;
      } else throw new NotFoundException();
    } catch (error) {
      throw error;
    }
  }
}
