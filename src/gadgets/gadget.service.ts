import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { HomeGadgetType } from "src/shared/enums/home_gadget.enum";
import { ApiUrl, CreateHomeGadget } from "./dto/gadgets.dto";

@Injectable()
export class GadgetService {
    constructor (private prisma: PrismaService){}

    async createGadgetForHome(dto: CreateHomeGadget) {
        dto.apiUrls = JSON.parse(dto.apiUrls);
        
        switch(dto.type) {
            case HomeGadgetType.TWO_SMALL_CARDS_HORIZONTAL:
                if (dto.apiUrls && dto.apiUrls.length === 2) {
                    
                }
                return;
             
            case HomeGadgetType.BANNER_SWIPE_WITH_DOTS:
                return;
             
            case HomeGadgetType.TWO_TO_TWO_WITH_TITLE_AS_IMAGE:
                return;
             
            case HomeGadgetType.BANNER_FOR_MEN_AND_WOMEN:
                return;
             
            case HomeGadgetType.TWO_TO_TWO_GRID_WITH_TITLE_AS_TEXT:
                return;
             
            case HomeGadgetType.CARDS_16_9_IN_HORIZONTAL_WITH_TITLE_AS_TEXT:
                return;

            case HomeGadgetType.CARDS_16_9_IN_HORIZONTAL_WITH_TITLE_AS_IMAGE:
                return;

            case HomeGadgetType.CARDS_2_3_IN_HORIZONTAL_WITH_TITLE_AS_IMAGE:
                return;


            case HomeGadgetType.ONE_IMAGE_WITH_FULL_WIDTH:
                return;


            case HomeGadgetType.CARDS_2_3_IN_HORIZONTAL_WITH_TITLE_AS_TEXT:
                return;


            case HomeGadgetType.POPULAR:
                return;


            case HomeGadgetType.TWO_TO_THREE_PRODUCTS_IN_HORIZONTAL_WITH_TITLE_AS_TEXT:
                return;
             
        }

    }
}   