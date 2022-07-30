import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAddressDTO } from './dto/create-address.dto';

@Injectable()
export class AddressService {
    constructor(private prisma: PrismaService) { }

    async getUserAddresses(userId: number) {
        try {
            var res = await this.prisma.user_Addresses.findMany({
                where: { userId: userId }, include: {
                   address: true
                },
            });
            if (res && res.length > 0) {
                for (let r of res) {
                    delete r.addressId
                    delete r.userId
                }
            }
            return res
        } catch (error) {
            throw error;
        }
    }

    async getAddressById(id: number) {
        try {
            var data = await this.prisma.address.findFirst({ where: { id: id } })
            if (data) {
                return data
            } else {
                throw new NotFoundException()
            }
        } catch (error) {
            throw error;
        }
    }

    async createAddress(dto: CreateAddressDTO) {
        try {
            let {
                addressLine1,
                addressLine2,
                title,
                userId } = dto

            console.log(dto);

            var addr = await this.prisma.address.create({
                data: {
                    addressLine1: addressLine1, addressLine2: addressLine2
                }
            });


            var res = await this.prisma.user_Addresses.create({
                data: {
                    title: title,
                    default: dto.default,
                    addressId: addr.id,
                    userId: userId,
                },
                include: {
                    user: true,
                    address: true,
                }
            });

            return res
        } catch (error) {
            throw error
        }
    }

    async updateAddress() { }


    async deleteAddress() { }

}
