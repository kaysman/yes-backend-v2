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
import { ProductBelongsToType } from './enums/belongsto.enum';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts(dto: FilterForProductDTO) {
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
            { color_id: color_id },
            { gender_id: gender_id },
            { brand_id: brand_id },
            { category_id: category_id },
            { market_id: market_id },
            { quantity: quantity },
            {
              AND: [
                { ourPrice: { gte: priceFrom } },
                { ourPrice: { lt: priceTo } },
              ],
            },
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

        

        var createdProducts = [];
        for (const r of Array.from({length: worksheet.rowCount - 1 },(v,k)=>k+2)) {
          let row = worksheet.getRow(r);

          var product = new CreateProductDTO();
          product.name_tm = row.values[1].trim();
          product.name_ru = row.values[2].trim();
          product.ourPrice = Number(row.values[3]);
          console.log(product.ourPrice);
          
          product.marketPrice = Number(row.values[4].trim());
          product.color_id = Number(row.values[5].trim());
          product.gender_id = Number(row.values[6].trim());
          product.code = row.values[8].trim();
          product.description_tm = row.values[9].trim();
          product.description_ru = row.values[10].trim();
          product.brand_id = Number(row.values[11].trim());
          product.category_id = Number(row.values[12].trim());
          product.market_id = Number(row.values[13].trim());

          // var newProduct = await this.prisma.product.create({
          //   data: product
          // });
          try {
            createdProducts.push();
          } catch (error) {}
        }
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
