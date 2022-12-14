import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
var morgan = require('morgan')
import * as path from 'path'
import * as fs from 'fs'
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const accessLogStream = fs.createWriteStream(path.join(__dirname,'../', 'access.log'), { flags: 'a' })

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(morgan('combined', { stream: accessLogStream }))
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || process.env.API_RUNNING_PORT);
}
bootstrap();
