import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDTO } from 'src/shared/dto/pagination.dto';

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateMarketDTO } from './dto/create-market.dto';
import { UpdateMarketDTO } from './dto/update-market.dto';

@Injectable()
export class MarketService {
  constructor(private prisma: PrismaService) {}

  async getMarkets(dto: PaginationDTO) {
    try {
      let { take, search, lastId: cursor } = dto;
      var markets;
      if (search) {
       markets = await this.searchMarket(search, take, cursor);
      } else {
       markets = await this.prisma.market.findMany({
          take,
          cursor: cursor ? { id: cursor } : undefined,
        });
      }
      // var response = new GetMarketsResponseDTO();
      // response.pagination = dto;
      // response.markets = markets;
      return markets;
    } catch (error) {
      throw error;
    }
  }

  async getMarketById(marketId: number) {
    try {
      var getMarket = await this.prisma.market.findUnique({
        where: { id: marketId },
        include: { products: true },
      });
      if (getMarket) {
        return getMarket;
      } else return new NotFoundException('market cannot be found');
    } catch (error) {
      throw error;
    }
  }

  async searchMarket(query: string, take: number, cursor?: number) {
    try {
      var markets = await this.prisma.market.findMany({
        take: take,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          OR: [
            {
              title: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              address: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
      });
      return markets;
    } catch (error) {
      throw error;
    }
  }

  async createMarket(dto: CreateMarketDTO) {
    try {
      var checkMarket = await this.prisma.market.findFirst({
        where: {
          title: dto.title,
        },
      });

      if (checkMarket) {
        throw new ForbiddenException('market already exists');
      } else {
        var newMarket = await this.prisma.market.create({
          data: { ...dto },
        });
        return newMarket;
      }
    } catch (error) {
      throw error;
    }
  }

  async updateMarket(dto: UpdateMarketDTO) {
    try {if (await this.prisma.market.findFirst({ where: { id: dto.id } })) {
        var market = await this.prisma.market.update({
          where: { id: dto.id },
          data: {
            title: dto.title ?? undefined,
            address: dto.address ?? undefined,
            description: dto.description ?? undefined,
            phoneNumber: dto.phoneNumber ?? undefined,
            ownerName: dto.ownerName ?? undefined,
          },
        });
        return market;
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteMarket(id: number) {
    try {
      if (await this.prisma.market.findFirst({where: {id: id}})){
        var res = await this.prisma.market.delete({where: {id: id}});
        return true;
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      throw error;
    }
  }
}
