import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { HomeGadgetType } from "src/shared/enums/home_gadget.enum";
import { CreateHomeGadget } from "./dto/gadgets.dto";

@Injectable()
export class GadgetService {
    constructor(private prisma: PrismaService) { }

    async getGadgets() {
        try {
            return await this.prisma.homeGadget.findMany({ orderBy: { queue: 'asc' } });
        } catch (error) {
            throw error;
        }
    }

    async createGadgetForHome(files: Array<Express.Multer.File>, dto: CreateHomeGadget) {
        var apiUrls = JSON.parse(dto.apiUrls) as Array<String>;
        var urlCount = apiUrls.length;
        var message;

        switch (dto.type) {
            case HomeGadgetType.TWO_SMALL_CARDS_HORIZONTAL:
                message = urlCount === 2 && files.length === 2 ? undefined : "Enter 2 links and upload 2 images";
                break;
            case HomeGadgetType.BANNER_SWIPE_WITH_DOTS:
                message = urlCount === files.length ? undefined : "Enter equal number of links with images";
                break;
            case HomeGadgetType.TWO_TO_TWO_WITH_TITLE_AS_IMAGE:
                message = urlCount === 5 && files.length === 5 ? undefined : "Enter 5 images and 5 links";
                break;
            case HomeGadgetType.BANNER_FOR_MEN_AND_WOMEN:
                message = urlCount === 2 && files.length === 1 ? undefined : "Enter 1 image and 2 links";
                break;

            case HomeGadgetType.TWO_TO_TWO_GRID_WITH_TITLE_AS_TEXT:
                message = urlCount === 4 && files.length === 4 && dto.title ? undefined : "Enter a title with 4 images and 4 links";
                break;

            case HomeGadgetType.CARDS_16_9_IN_HORIZONTAL_WITH_TITLE_AS_TEXT:
                message = dto.title && urlCount === files.length ? undefined : "Enter a title with equal number of images and links";
                break;

            case HomeGadgetType.CARDS_16_9_IN_HORIZONTAL_WITH_TITLE_AS_IMAGE:
                message = urlCount === files.length ? undefined : "Enter equal number of images and links";
                break;

            case HomeGadgetType.CARDS_2_3_IN_HORIZONTAL_WITH_TITLE_AS_IMAGE:
                message = urlCount === files.length ? undefined : "Enter equal number of images and links";
                break;


            case HomeGadgetType.ONE_IMAGE_WITH_FULL_WIDTH:
                message = urlCount === 1 && files.length === 1 ? undefined : "Enter 1 link and 1 image";
                break;

            case HomeGadgetType.CARDS_2_3_IN_HORIZONTAL_WITH_TITLE_AS_TEXT:
                message = dto.title && urlCount === files.length ? undefined : "Enter a title with equal number of images and links";
                break;

            case HomeGadgetType.POPULAR:
                message = 'Popular is not ready yet. Coming soon!'
                break;


            case HomeGadgetType.TWO_TO_THREE_PRODUCTS_IN_HORIZONTAL_WITH_TITLE_AS_TEXT:
                var productIds = JSON.parse(dto.productIds) as Array<String>;
                // TODO: check product ids
                message = dto.title && productIds && productIds.length > 1 ? undefined : "Enter a title and select products to display horizontally.";
                break;

            default:
                message = "Incorrect Input";
                break;

        }

        if (message) {
            throw new BadRequestException(message);
        }

        try {
            return await this.prisma.homeGadget.create({data: {
                type: dto.type.toString(),
                apiUrls: dto.apiUrls,
                imageUrls: dto.apiUrls, // TODO:
                brandIds: dto.brandIds,
                productIds: dto.productIds,
                swiperBannersCount: dto.swiperBannersCount,
                queue: 1,
            }});
        } catch (error) {
            throw error;
        }

    }
}