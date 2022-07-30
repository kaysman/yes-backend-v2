import { Module } from '@nestjs/common';
import { ProductModule } from 'src/product/product.module';
import { GadgetController } from './gadget.controller';
import { GadgetService } from './gadget.service';

@Module({
    imports: [ProductModule],
    controllers: [GadgetController],
    providers: [GadgetService],
})
export class GadgetModule {}
