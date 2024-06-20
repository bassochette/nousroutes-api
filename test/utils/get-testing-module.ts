import { ModuleMetadata } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { pgMemDatasource } from './pg-mem-datasource';

export const getTestingModuleWihInMemoryDB = (
  moduleMetadata: ModuleMetadata,
): Promise<TestingModule> => {
  return Test.createTestingModule({
    imports: [TypeOrmModule.forRoot({}), ...(moduleMetadata.imports ?? [])],
    providers: moduleMetadata.providers,
  })
    .overrideProvider(DataSource)
    .useValue(pgMemDatasource())
    .compile();
};
