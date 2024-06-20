import { DataSource } from 'typeorm';
import { DataType, newDb } from 'pg-mem';
import { v4 } from 'uuid';
import { Travel } from '../../src/travel/entities/travel.entity';
import { travelSeeds } from '../../src/migrations/seeds/travels';

// This datasource can be tedious to maintain but it's a really cool tool for integration testing (e2e in the style of the nestjs template)
export const pgMemDatasource = async () => {
  const db = newDb({
    autoCreateForeignKeyIndices: true,
  });

  db.public.registerFunction({
    implementation: () => 'test',
    name: 'current_database',
  });

  db.public.registerFunction({
    implementation: () => 'test',
    name: 'version',
  });

  db.public.registerFunction({
    name: 'obj_description',
    args: [DataType.text, DataType.text],
    returns: DataType.text,
    implementation: () => 'test',
  });

  db.registerExtension('uuid-ossp', (schema) => {
    schema.registerFunction({
      name: 'uuid_generate_v4',
      returns: DataType.uuid,
      implementation: v4,
      impure: true,
    });
  });

  const ds: DataSource = await db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: [__dirname + '/../../src/**/*.entity{.ts,.js}'],
  });
  await ds.initialize();
  await ds.synchronize();

  // seeding
  const travelRepository = ds.getRepository(Travel);
  await travelRepository.save(
    travelSeeds.map((seed) => travelRepository.create(seed)),
  );

  return ds;
};
