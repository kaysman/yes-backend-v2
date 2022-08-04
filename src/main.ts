import * as bodyParser from 'body-parser';
import { join } from 'path';

import {
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import {
  NestFactory,
  Reflector,
} from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
  app.enableCors();
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await app.listen(3333, '192.168.1.5');
}
bootstrap();
