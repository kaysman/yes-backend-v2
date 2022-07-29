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
import { DeleteManyProductsDTO } from './dto/delete-many.dto';

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
        product["images"] = []
        if (image) {
          image.image = publicFilePath(image.image);
          if (product['images'].length === 0) product["images"].push(image)
        }
        var sizes = [];
        for (let size of product.sizes) {
          var kSize = await this.prisma.filter.findFirst({ where: { id: size.size_id } });
          if (kSize) {
            kSize["quantity"] = size.quantity;
            sizes.push(kSize);
          }
        }
        product.sizes = sizes;
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
        var sizes = [];
        for (let size of getProduct.sizes) {
          var kSize = await this.prisma.filter.findFirst({ where: { id: size.size_id } });
          kSize["quantity"] = size.quantity;
          sizes.push(kSize);
        }
        getProduct.sizes = sizes;

        // images
        for (let image of getProduct.images) {
          image.image = publicFilePath(image.image);
        }
        return getProduct;
      } else throw new NotFoundException();
    } catch (error) {
      throw error;
    }
  }

  async uploadExcel(file: Express.Multer.File) {

    /*
      1. Name TM
      2. Name RU
      3. Our price
      4. Their Price
      5. Color
      6. Gender
      7. Product Code
      8. Description TM
      9. Description RU
      10. Brand ID
      11. Subcategory ID
      12. Market ID
      13. Size IDs
    */

    let productsCreated = []

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

      var a = await workbook.xlsx.load(buffer);
      let worksheet = workbook.worksheets[0];

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
      var sizes = worksheet.getColumn(13).values;

      for (var i = 2; i <= sizes.length - 1; i++) {
        if (!sizes[i] || sizes[i].length === 0) throw new NotFoundException(`C13:R${i} is empty`)
        var cellValues = sizes[i].split(',');

        cellValues.forEach((value) => {
          // value -> <size_id> : <count> e.g 4:1000
          let sizeAndCount = value.trim().split(':')
          let size_id = sizeAndCount[0]
          let count = sizeAndCount[1]
          if (!dbSizes.includes(Number(size_id))) {
            throw new NotFoundException(
              'Size with id:' +
              size_id +
              ' at row:' +
              i +
              ' not found, please correct it and try again.',
            );
          }
        });
      }
      // ----------------- end --------------------

      // ------- brand -> 11th index -------------
      var brands = worksheet.getColumn(10).values;

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
      var categories = worksheet.getColumn(11).values;

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
      var markets = worksheet.getColumn(12).values;

      for (var i = 2; i <= markets.length - 1; i++) {
        if (!dbMarkets.includes(Number(markets[i]))) {
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


      for (let r of Array.from({ length: worksheet.rowCount - 1 }, (v, k) => k + 2)) {
        let row = worksheet.getRow(r);
        let sizesToCreate = []
        let sizess: string[] = row.values[13].split(',');
        sizess.forEach(e => {
          const x = e.split(':')
          sizesToCreate.push({
            size_id: parseInt(x[0]),
            quantity: parseInt(x[1]),
          })
        });


        var prdt = {
          name_tm: row.values[1],
          name_ru: row.values[2],
          ourPrice: parseInt(row.values[3]),
          marketPrice: row.values[4] && row.values[4].length > 0 ? Number(row.values[4]) : Number(row.values[3]) - 10,
          color_id: parseInt(row.values[5]),
          gender_id: parseInt(row.values[6]),
          code: row.values[7],
          description_tm: row.values[8],
          description_ru: row.values[9],
          brand_id: parseInt(row.values[10]),
          category_id: parseInt(row.values[11]),
          market_id: parseInt(row.values[12]),
          sizes: { create: sizesToCreate },
        }

        var res = await this.prisma.product.create({ data: prdt })
        productsCreated.push(res.id);
      }

      return `${productsCreated.length} products created`;
    } catch (error) {

      if (productsCreated.length > 0) {
        await this.prisma.product.deleteMany({
          where: {
            id: {
              in: productsCreated
            }
          }
        })
      }

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

        var parsedSizes = JSON.parse(dto.sizes.toString()) as SizeItemDTO[];
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


  async uploadImages(files: Express.Multer.File[]) {
    try {

      console.log('------- Analyzing Images -------');
      let prdIds = []
      let buffers = []
      for (let file of files) {
        const img = file.originalname.split('_');
        const name = img[0]
        const prdt = await this.prisma.product.findFirst({ where: { code: name } })
        if (!prdt) {
          const msg = `There is no product with code ${name}. Filename: ${file.originalname}`
          console.log(msg);
          throw new BadRequestException(msg)
        } else {
          // if (!prdIds[prdt.id]) prdIds[prdt.id] = []
          var filename = editFileName(file)
          prdIds.push({
            productId: prdt.id,
            image: filename,
          })
          buffers.push({
            buffer: file.buffer,
            name: filename,
          })
        }
      }

      // console.log(prdIds);
      await this.prisma.product_Images.createMany({ data: prdIds });
      for (let file of buffers) {
        await saveFile(file.name, file.buffer);
      }

      return true
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
        where: { id: Number(id) }
      });

      if (getProduct) {
        var res = await this.prisma.product.update({
          where: { id: Number(id) },
          data: {
            name_tm: name_tm ?? undefined,
            name_ru: name_ru ?? undefined,
            ourPrice: ourPrice ?? undefined,
            marketPrice: marketPrice ?? undefined,
            color_id: color_id ?? undefined,
            gender_id: gender_id ?? undefined,
            description_tm: description_tm ?? undefined,
            description_ru: description_ru ?? undefined,
            brand_id: brand_id ?? undefined,
            category_id: category_id ?? undefined,
            market_id: market_id ?? undefined,
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

        return await this.getProductById(res.id);
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

  async deleteMultipleProducts(dto: DeleteManyProductsDTO) {
    try {
      const parsed = JSON.parse(dto.ids.toString()) as number[]
      console.log('asdasdasd');
      
      let imgs = []
      for (let id of parsed) {
        var prdt = await this.prisma.product.findFirst({where: {id: id}, include: {images: true}})
        if (!prdt){
          const msg = `There is no product with id ${id}.`
          throw new BadRequestException(msg)
        } else {
          imgs.concat(prdt.images.map(e => e.image))
        }
      }

      await this.prisma.product.deleteMany({where: {id: {in: parsed}}})
      for (let img of imgs) {
        deleteFile(img)
      }
    } catch (error) {
      throw error;
    }
  }
}
