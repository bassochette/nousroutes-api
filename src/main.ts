import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { appConfig } from './configurations/app.config';
import { ConfigType } from '@nestjs/config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.use(helmet());

  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
  await app.listen(config.port);
}
bootstrap();
