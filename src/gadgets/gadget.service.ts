import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { GadgetType } from "src/shared/enums/home_gadget.enum";
import { deleteFile, editFileName, getFilesInDirectory, publicFilePath, saveFile } from "src/shared/helper";
import { CreateGadget, CreateGadgetLink } from "./dto/create-gadget.dto";
import { GetGadgetDTO, GetGadgetLinkImage, GetGadgetQuery } from "./dto/get-gadget.dto";
import { UpdateGadgetDTO } from "./dto/update-gadget.dto";

@Injectable()
export class GadgetService {
    constructor(private prisma: PrismaService) { }

    async getGadgetById(id: number) {
        try {
            var gadget = await this.prisma.gadget.findFirst({ where: { id: id } });
            if (gadget) {
                var dto = new GetGadgetDTO()
                dto.queue = gadget.queue
                dto.title = gadget.title
                dto.type = gadget.type
                dto.status = gadget.status
                dto.location = gadget.location

                var links = (await this.prisma.gadget_Links.findMany({ where: { gadgetId: id } })).map(e => e.link);

                var images = (await this.prisma.gadget_Images.findMany({ where: { gadgetId: id } })).map(e => publicFilePath(e.image));

                var items: GetGadgetLinkImage[] = []
                for (let i = 0; i < links.length; i++) {
                    var item = new GetGadgetLinkImage()
                    item.image = images[i]
                    item.link = links[i]
                    items.push(item)
                }

                dto.items = items

                return dto
            }
        } catch (error) {
            throw error;
        }
    }

    async getGadgets(query: GetGadgetQuery) {
        let statusAll = query.status !== 'ACTIVE' && query.status !== 'INACTIVE'
        try {
            var res = await this.prisma.gadget.findMany({
                where: {
                    location: query.tab,
                    status: statusAll ? undefined : query.status,
                },
                orderBy: { queue: 'asc' },
                include: {
                    links: true,
                    images: true,
                    productIds: true,
                }
            });


            for (let i = 0; i < res.length; i++) {
                var items: GetGadgetLinkImage[] = []
                var item = new GetGadgetLinkImage()
                for (let img of res[i].images) {
                    item.image = publicFilePath(img.image)
                    item.link = res[i].links[res[i].images.indexOf(img)].link
                    items.push(item)
                }
                res[i]['items'] = items
                delete res[i].links
                delete res[i].images
            }

            return res


        } catch (error) {
            throw error;
        }
    }

    async createGadget(files: Array<Express.Multer.File>, dto: CreateGadget) {

        let {
            type,
            title,
            links,
            productIds,
            queue,
            status,
            location,
        } = dto

        links = JSON.parse(links.toString()) as CreateGadgetLink[];

        var urlCount = links.length;
        var message: string;

        switch (type) {
            case GadgetType.TWO_SMALL_CARDS_HORIZONTAL:
                message = urlCount === 2 && files.length === 2 ? undefined : "Enter 2 links and upload 2 images";
                break;
            case GadgetType.BANNER_SWIPE_WITH_DOTS:
                message = urlCount === files.length ? undefined : "Enter equal number of links with images";
                break;
            case GadgetType.TWO_TO_TWO_WITH_TITLE_AS_IMAGE:
                message = urlCount === 5 && files.length === 5 ? undefined : "Enter 5 images and 5 links";
                break;
            case GadgetType.BANNER_FOR_MEN_AND_WOMEN:
                message = urlCount === 2 && files.length === 1 ? undefined : "Enter 1 image and 2 links";
                break;

            case GadgetType.TWO_TO_TWO_GRID_WITH_TITLE_AS_TEXT:
                message = urlCount === 4 && files.length === 4 && title ? undefined : "Enter a title with 4 images and 4 links";
                break;

            case GadgetType.CARDS_16_9_IN_HORIZONTAL_WITH_TITLE_AS_TEXT:
                message = title && urlCount === files.length ? undefined : "Enter a title with equal number of images and links";
                break;

            case GadgetType.CARDS_16_9_IN_HORIZONTAL_WITH_TITLE_AS_IMAGE:
                message = urlCount === files.length ? undefined : "Enter equal number of images and links";
                break;

            case GadgetType.CARDS_2_3_IN_HORIZONTAL_WITH_TITLE_AS_IMAGE:
                message = urlCount === files.length ? undefined : "Enter equal number of images and links";
                break;


            case GadgetType.ONE_IMAGE_WITH_FULL_WIDTH:
                message = urlCount === 1 && files.length === 1 ? undefined : "Enter 1 link and 1 image";
                break;

            case GadgetType.CARDS_2_3_IN_HORIZONTAL_WITH_TITLE_AS_TEXT:
                message = title && urlCount === files.length ? undefined : "Enter a title with equal number of images and links";
                break;

            case GadgetType.POPULAR:
                message = 'Popular is not ready yet. Coming soon!'
                break;

            case GadgetType.TWO_TO_THREE_PRODUCTS_IN_HORIZONTAL_WITH_TITLE_AS_TEXT:
                // TODO: check product ids
                message = title && productIds && productIds.length > 2 ? undefined : "Enter a title and select products to display horizontally.";
                break;

            case GadgetType.CIRCLE_ITEMS:
                message = urlCount === files.length ? undefined : "Enter equal number of images and links";
                break;

            case GadgetType.CATEGORY_BANNER:
                for (let linkAndImage of links) {
                    if (!linkAndImage.subcategories) {
                        message = "No sub items selected for one of the mains.";
                        break;
                    }
                }
                break;

            default:
                message = "Incorrect Input";
                break;

        }

        if (message) {
            throw new BadRequestException(message);
        }

        try {
            var data = [];
            for (let l of links) {
                data.push({ link: l.link })
            }

            var imgs = []
            for (let f of files) {
                var filename = editFileName(f)
                imgs.push({ image: filename })
            }

            var gadget = await this.prisma.gadget.create({
                data: {
                    type: type.toString(),
                    title: title,
                    queue: queue,
                    status: status,
                    location: location,
                    links: { create: data },
                    images: { create: imgs }
                }
            });

            
            for (let f of files) {
                await saveFile(editFileName(f), f.buffer);
            }

            return await this.getGadgetById(gadget.id);
        } catch (error) {
            throw error;
        }

    }

    async updateGadget(dto: UpdateGadgetDTO) {
        try {
            if (await this.prisma.gadget.findFirst({ where: {} })) {
                var gadget = await this.prisma.gadget.update({
                    where: { id: dto.id },
                    data: {
                        title: dto.title ?? undefined,
                        queue: dto.queue ?? undefined,
                        status: dto.status ?? undefined,
                        location: dto.location ?? undefined,
                    }
                });
                return await this.getGadgetById(gadget.id);
            } else {
                throw new NotFoundException();
            }
        } catch (error) {
            throw error;
        }
    }


    async deleteGadget(id: number) {
        try {
            if (await this.prisma.gadget.findFirst({ where: { id: id } })){
                var res = await this.prisma.gadget.delete({where: {id: id}, include: {images: true}})
                for (let img of res.images) {
                    await deleteFile(img.image)                    
                }
            }
            else {
                throw new NotFoundException()
            }
        } catch (error) {
            throw error
        }
    }
}