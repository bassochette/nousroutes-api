import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { appConfig } from './configurations/app.config';
import { ConfigType } from '@nestjs/config';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.use(helmet());

  const swaggerCongig = new DocumentBuilder()
    .setTitle('WeRoad API')
    .setDescription('Technical case Julien Prugne julien@webeleon.dev')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerCongig);
  SwaggerModule.setup('swagger', app, document);

  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
  await app.listen(config.port);
}
bootstrap();
