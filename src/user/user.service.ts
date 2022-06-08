import { PrismaService } from 'src/prisma/prisma.service';

import { Injectable } from '@nestjs/common';

import { CreateUserDTO } from './dto/create-user.dto';
import { GetUserByPhoneNumberDTO } from './dto/get-user-phone.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService){}


    async createUser (dto: CreateUserDTO){
        try {
            var checkUser = await this.prisma.user.findFirst({
                where:{
                    phoneNumber: dto.phoneNumber
                }

            
            })
            if (!checkUser){
                var newUser = await this.prisma.user.create({data: dto})
                delete newUser.password
                return newUser
            }
        } catch (error) {
            throw error
        }
    }
    
    async getUserByPhoneNumber(dto:GetUserByPhoneNumberDTO){
        try {
            var user = await this.prisma.user.findFirst({
                where:{
                    phoneNumber: dto.phoneNumber
                }
            })
            delete user.password
            return user
        } catch (error) {
            throw error
        }
    }
}
