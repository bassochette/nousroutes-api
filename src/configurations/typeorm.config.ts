import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig();

const config = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/../**/*.migration.{ts,js}'],
  synchronize: false,
  autoLoadEntities: true,
};

export const TypeormConfig = registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
export default TypeormConfig;
