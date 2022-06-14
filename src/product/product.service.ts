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
import { UploadExcelDTO } from './dto/upload-excel.dto';
import { ProductBelongsToType } from './enums/belongsto.enum';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts(dto: FilterForProductDTO) {
    console.log(dto);
    
    try {
      let {
        priceFrom,
        priceTo,
        color_id,
        gender_id,
        quantity,
        brand_id,
        category_id,
        market_id,
        size_id,
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
            {color_id: color_id},
            {gender_id: gender_id},
            {brand_id: brand_id},
            {category_id: category_id},
            {market_id: market_id},
            {quantity: quantity},
            {
              AND: [
                { ourPrice: { gte: priceFrom } },
                { ourPrice: { lt: priceTo } },
              ],
            }
          ],
        },
      });
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
      });
      if (getProduct) {
        return getProduct;
      } else return new NotFoundException('product cannot be found');
    } catch (error) {
      throw error;
    }
  }

  async uploadExcel(dto: UploadExcelDTO) {
    try {
      const exceljs = require('exceljs');
      let buffer = Buffer.from(dto.excelBase64String, 'base64');
      let columns = [];
      var workbook = new exceljs.Workbook();
      await workbook.xlsx.load(buffer).then(() => {
        var worksheet = workbook.worksheets[0];
        var row = worksheet.LastRow;
        columns = worksheet.getRow(1).values;
      });
    } catch (error) {
      throw error;
    }
  }

  async createProduct(dto: CreateProductDTO) {
    try {
      var sizes = JSON.parse(dto.sizes.toString()) as Array<SizeItemDTO>;
      var checkProduct = await this.prisma.product.findFirst({
        where: {
          code: dto.code,
        },
      });

      if (!checkProduct) {
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
            quantity: 0,
            code: dto.code,
          },
        });
        newProduct['sizes'] = dto.sizes;
        var countTotal = 0;
        for (var i = 0; i < sizes.length; i++) {
          var size = sizes[i];
          countTotal = countTotal + size.count;
          await this.prisma.filter_Product.create({
            data: {
              size_id: size.size_id,
              quantity: size.count,
              product_id: newProduct.id,
            },
          });
        }
        console.log(countTotal);

        var updateProduct = await this.prisma.product.update({
          where: {
            id: newProduct.id,
          },
          data: {
            quantity: countTotal,
          },
        });
        return updateProduct;
      } else return new BadRequestException('this product already exits');
    } catch (error) {
      throw error;
    }
  }

  private async getProducts(
    filter: FilterForProductDTO,
    type: ProductBelongsToType,
    id: number,
  ) {
    // var cursor = filter.lastProductId;
    // var take = filter.take;
    // delete filter.lastProductId;
    // delete filter.take;
    // if (type === ProductBelongsToType.MARKET) {
    //   filter.market_id = id;
    // } else if (type === ProductBelongsToType.BRAND) {
    //   filter.brand_id = id;
    // } else if (type === ProductBelongsToType.CATEGORY) {
    //   filter.category_id = id;
    // } else if (type === ProductBelongsToType.COLOR) {
    //   filter.color_id = id;
    // } else if (type === ProductBelongsToType.GENDER) {
    //   filter.gender_id = id;
    // } else if (type === ProductBelongsToType.SIZE) {
    //   filter.size_id = id;
    // }
    // let {
    //   name_tm,
    //   name_ru,
    //   price,
    //   color_id,
    //   gender_id,
    //   quantity,
    //   code,
    //   description_tm,
    //   description_ru,
    //   brand_id,
    //   category_id,
    //   market_id,
    //   size_id,
    // } = filter;
    // console.log(filter);
    // if (!cursor) {
    //   var check = await this.prisma.product.findFirst({
    //     where: {
    //       name_tm: filter.name_tm,
    //       name_ru: filter.name_ru,
    //       price: filter.price,
    //       color_id: filter.color_id,
    //       gender_id: filter.gender_id,
    //       description_ru: filter.description_ru,
    //       description_tm: filter.description_tm,
    //       brand_id: filter.brand_id,
    //       market_id: filter.market_id,
    //       category_id: filter.category_id,
    //       quantity: filter.quantity,
    //       code: filter.code,
    //       filter_Product: {
    //         some: {
    //           size_id: filter.size_id,
    //         },
    //       },
    //     },
    //   });
    //   console.log(check);
    //   if (check) cursor = check.id;
    //   else return [];
    // }
    // var checkProduct = await this.prisma.product.findFirst({
    //   where: {
    //     id: cursor,
    //     name_tm: filter.name_tm,
    //     name_ru: filter.name_ru,
    //     price: filter.price,
    //     color_id: filter.color_id,
    //     gender_id: filter.gender_id,
    //     description_ru: filter.description_ru,
    //     description_tm: filter.description_tm,
    //     brand_id: filter.brand_id,
    //     market_id: filter.market_id,
    //     category_id: filter.category_id,
    //     quantity: filter.quantity,
    //     code: filter.code,
    //     filter_Product: {
    //       some: {
    //         product_id: filter.size_id,
    //       },
    //     },
    //   },
    // });
    // while (!checkProduct) {
    //   cursor++;
    //   checkProduct = await this.prisma.product.findFirst({
    //     where: {
    //       id: cursor,
    //       name_tm: filter.name_tm,
    //       name_ru: filter.name_ru,
    //       price: filter.price,
    //       color_id: filter.color_id,
    //       gender_id: filter.gender_id,
    //       description_ru: filter.description_ru,
    //       description_tm: filter.description_tm,
    //       brand_id: filter.brand_id,
    //       market_id: filter.market_id,
    //       category_id: filter.category_id,
    //       quantity: filter.quantity,
    //       code: filter.code,
    //       filter_Product: {
    //         some: {
    //           product_id: filter.size_id,
    //         },
    //       },
    //     },
    //   });
    // }
    // var getProducts = await this.prisma.product.findMany({
    //   where: {
    //     name_tm: filter.name_tm,
    //     name_ru: filter.name_ru,
    //     price: filter.price,
    //     color_id: filter.color_id,
    //     gender_id: filter.gender_id,
    //     description_ru: filter.description_ru,
    //     description_tm: filter.description_tm,
    //     brand_id: filter.brand_id,
    //     market_id: filter.market_id,
    //     category_id: filter.category_id,
    //     quantity: filter.quantity,
    //     code: filter.code,
    //     filter_Product: {
    //       some: {
    //         product_id: filter.size_id,
    //       },
    //     },
    //   },
    //   take,
    //   cursor: { id: checkProduct.id },
    // });
    // return getProducts;
  }
}
