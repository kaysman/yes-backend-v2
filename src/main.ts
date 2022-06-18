import * as bodyParser from 'body-parser';

import {
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import {
  NestFactory,
  Reflector,
} from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
  app.enableCors();
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await app.listen(3333);
}
bootstrap();
