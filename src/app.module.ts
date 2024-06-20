import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './configurations/app.config';
import { TypeormConfig } from './configurations/typeorm.config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { TravelModule } from './travel/travel.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

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
    // in a real production app use the forRootAsync method and disable playground based on the NODE_ENV
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    TravelModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
