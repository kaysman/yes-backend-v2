import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashString } from 'src/shared/helper';
import {
  CreateUserDTO,
  LoginDTO,
} from 'src/user/dto';

import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from './jwt/jwt-payload.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    async signup(createUserDTO: CreateUserDTO) {
        try {
          var user = await this.prisma.user.findFirst({
            where: {
              phoneNumber: createUserDTO.phoneNumber,
            },
          });
    
          if (!user) {
            var hashedPassword = await hashString(createUserDTO.password);
            createUserDTO.password = hashedPassword;
            var newUser = await this.prisma.user.create({
              data: createUserDTO,
            });
    
            return newUser;
          } else {
            throw new ForbiddenException('User already taken');
          }
        } catch (error) {
          throw error;
        }
      }
    
      async signin(logindDto: LoginDTO) {
        
        console.log(logindDto);
        
        try {
          var user = await this.prisma.user.findFirst({
            where: {
               phoneNumber: logindDto.phoneNumber,
            },
          });
          console.log("user: ",user);
          
          if (user && (await argon.verify(user.password, logindDto.password))) {
            var token = await this.signToken({
              username: logindDto.phoneNumber,
              password: logindDto.password,
            });
            delete user.password;
            user['token'] = token;
            return user;
          } else {
            throw new ForbiddenException('Incorrect credentials');
          }
        } catch (_) {
          throw _;
        }
      }
    
      async signToken(payload: JwtPayload): Promise<string> {
        try {
          var token = await this.jwtService.signAsync(payload);
          return token;
        } catch (_) {
          throw _;
        }
      }
}
