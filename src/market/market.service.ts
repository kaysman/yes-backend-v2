import { PrismaService } from 'src/prisma/prisma.service';
import {
  getImagePath,
  writeWebpFile,
} from 'src/shared/helper';

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateMarketDTO } from './dto/create-market.dto';

@Injectable()
export class MarketService {
  constructor(private prisma: PrismaService) {}

  async getAllMarkets() {
    try {
      var allMarkets = await this.prisma.market.findMany();
      return allMarkets;
    } catch (error) {
      throw error;
    }
  }

  async getMarketById(marketId: number) {
    try {
      var getMarket = await this.prisma.market.findUnique({
        where: { id: marketId },
      });
      if (getMarket) {
        return getMarket;
      } else return new NotFoundException('market cannot be found');
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
      if (!checkMarket) {
        var newMarket = await this.prisma.market.create({
          data: { ...dto },
        });

        if (dto.logo) {
          var marketName = dto.title;
          await writeWebpFile(dto.logo, marketName);
        }
        newMarket.logo = getImagePath(marketName);
        return newMarket;
      } else return new ForbiddenException('market already exists');
    } catch (error) {
      throw error;
    }
  }
}
