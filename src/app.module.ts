import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './configurations/app.config';
import { TypeormConfig } from './configurations/typeorm.config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, TypeormConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(TypeormConfig)],
      inject: [TypeormConfig.KEY],
      useFactory: (config: TypeOrmModuleAsyncOptions) => config,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
