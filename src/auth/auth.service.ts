import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  hashString,
  writeFileFromBase64,
} from 'src/shared/helper';
import {
  CreateUserDTO,
  LoginDTO,
} from 'src/user/dto';

import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { CredentialsDTO } from './dto/credentials.dto';
import { JwtPayload } from './jwt/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService, private config: ConfigService,) {}

  async signup(dto: CreateUserDTO) {
    try {
      var checkUser = await this.prisma.user.findFirst({
        where: {
          phoneNumber: dto.phoneNumber,
        },
      });
      if (!checkUser) {
        var hashedPassword = await hashString(dto.password);
        dto.password = hashedPassword;
        // TODO: handle image storing/accessing 
        if (dto.image) {
          var fileName = dto.phoneNumber;
          await writeFileFromBase64(dto.image, fileName);
        }

        var newUser = await this.prisma.user.create({
          data: dto
        });
        

        var token = await this.signToken({
          username: dto.phoneNumber,
          password: dto.password,
        });

        var credentials = new CredentialsDTO()
        credentials.access_token = token;
        credentials.expiresIn = this.config.get('JWT_EXP_H')
        
        return credentials;
      }
    } catch (error) {
      throw error;
    }
  }

  async signin(logindDto: LoginDTO) {
    try {
      var user = await this.prisma.user.findFirst({
        where: {
          phoneNumber: logindDto.phoneNumber,
        },
      });

      if (user && (await argon.verify(user.password, logindDto.password))) {
        var token = await this.signToken({
          username: logindDto.phoneNumber,
          password: logindDto.password,
        });

        var credentials = new CredentialsDTO()
        credentials.access_token = token;
        credentials.expiresIn = this.config.get('JWT_EXP_H')
        
        return credentials;
      } else {
        throw new ForbiddenException('Incorrect credentials');
      }
    } catch (_) {
      throw _;
    }
  }

  async signToken(payload: JwtPayload): Promise<string> {
    try {
      var token = await this.jwtService.signAsync(payload, {
        expiresIn: this.config.get('JWT_EXP_H'),
        secret: this.config.get('JWT_SECRET'),
      });
      return token;
    } catch (_) {
      throw _;
    }
  }
}
