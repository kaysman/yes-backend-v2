import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAddressDTO } from './dto/create-address.dto';

@Injectable()
export class AddressService {
    constructor(private prisma: PrismaService){}

    async getAddresses(){
        try {
            return await this.prisma.address.findMany();
        } catch (error) {
            throw error;
        }
    }

    async getAddressById(id: number){
        try {
            var data = await this.prisma.address.findFirst({where: {id: id}})
            if (data){
                return data 
            } else {
                throw new NotFoundException()
            }
        } catch (error) {
            throw error;
        }
    }
    
    async createAddress(dto: CreateAddressDTO){
        // TODO:
    }

    
    async updateAddress(){}

    
    async deleteAddress(){}

}
