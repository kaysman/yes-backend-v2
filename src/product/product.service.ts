import { PrismaService } from 'src/prisma/prisma.service';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateProductDTO } from './dto/craete-product.dto';
import { FilterForProductDTO } from './dto/filter-for-product.dto';
import { ProductBelongsToType } from './enums/belongsto.enum';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts() {
    try {
      var allProducts = await this.prisma.product.findMany();
      return allProducts;
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

  async getMarketProducts(marketId: number, pagination: FilterForProductDTO) {
    try {
      return await this.getProducts(
        pagination,
        ProductBelongsToType.MARKET,
        marketId,
      );
    } catch (error) {
      throw error;
    }
  }

  async getBrandProducts(brandId: number, pagination: FilterForProductDTO) {
    try {
      return await this.getProducts(
        pagination,
        ProductBelongsToType.BRAND,
        brandId,
      );
    } catch (error) {
      throw error;
    }
  }

  async getCategoryProducts(
    categoryId: number,
    pagination: FilterForProductDTO,
  ) {
    try {
      return await this.getProducts(
        pagination,
        ProductBelongsToType.CATEGORY,
        categoryId,
      );
    } catch (error) {
      throw error;
    }
  }

  async createProduct(dto: CreateProductDTO) {
    try {
      var checkProduct = await this.prisma.product.findFirst({
        where: {
          name_tm: dto.name_tm,
        },
      });
      if (!checkProduct) {
        console.log(typeof dto.brand_id);
        for (var i = 1; i <= 1000; i++) {
          dto.name_tm = dto.name_tm + i.toString();
          var newProduct = await this.prisma.product.create({ data: dto });
        }
        return 'Created 1000 products with same dto';
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

    var cursor = filter.lastProductId;
    var take = filter.take;
    delete filter.lastProductId;
    delete filter.take;

    if (type === ProductBelongsToType.MARKET) {
      filter.market_id = id;
    } else if (type === ProductBelongsToType.BRAND) {
      filter.brand_id = id;
    } else if (type === ProductBelongsToType.CATEGORY) {
      filter.category_id = id;
    } else if (type === ProductBelongsToType.COLOR) {
      filter.color_id = id;
    } else if (type === ProductBelongsToType.GENDER) {
      filter.gender_id = id;
    }

    let {
      name_tm,
      name_ru,
      price,
      color_id,
      gender_id,
      quantity,
      code,
      description_tm,
      description_ru,
      brand_id,
      category_id,
      market_id,
    } = filter;

    console.log(filter);
    

    if (!cursor) {
      var check = await this.prisma.product.findFirst({ where: { ...filter } });
      console.log(check);
      if (check) cursor = check.id;
      else return [];
    }

    var checkProduct = await this.prisma.product.findFirst({
      where: { id: cursor, ...filter },
    });

    while (!checkProduct) {
      cursor++;
      checkProduct = await this.prisma.product.findFirst({
        where: { id: cursor, ...filter },
      });
    }

    var getProducts = await this.prisma.product.findMany({
      where: { ...filter },
      take,
      cursor: { id: checkProduct.id },
    });
    return getProducts;
  }
}
