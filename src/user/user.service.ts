import { PrismaService } from 'src/prisma/prisma.service';
import { hashString } from 'src/shared/helper';

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateUserDTO } from './dto/create-user.dto';
import { GetUserByPhoneNumberDTO } from './dto/get-user-phone.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: CreateUserDTO) {
    try {
      var checkUser = await this.prisma.user.findFirst({
        where: {
          phoneNumber: dto.phoneNumber,
        },
      });
      if (!checkUser) {
        var hashedPassword = await hashString(dto.password);
        dto.password = hashedPassword;
        var newUser = await this.prisma.user.create({
          data: {
            name: dto.name,
            phoneNumber: dto.phoneNumber,
            password: dto.password, // TODO: hash password before save.
            address: dto.address,
            gender: dto.gender,
            role: dto.role,
          },
        });
        if (dto.image) {
          console.log('we are here');

          // var fileName = dto.phoneNumber;
          // return await writeFileFromBase64(dto.image, fileName);
        }
        delete newUser.password;
        return newUser;
      }
    } catch (error) {
      throw error;
    }
  }

  async getUserByPhoneNumber(dto: GetUserByPhoneNumberDTO) {
    try {
      var user = await this.prisma.user.findFirst({
        where: {
          phoneNumber: dto.phoneNumber,
        },
      });
      delete user.password;
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: number) {
    try {
      var user = await this.prisma.user.findFirst({
        where: { id: id },
      });
      if (user) {
        delete user.password;
        return user;
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      throw error;
    }
  }
}
