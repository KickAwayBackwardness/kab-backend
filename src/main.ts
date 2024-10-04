import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: ['*', 'http://localhost:5174', 'http://localhost:5173'],
  });

  // middelware
  app.use(express.static('.'));

  await app.listen(3000);
}
bootstrap();
