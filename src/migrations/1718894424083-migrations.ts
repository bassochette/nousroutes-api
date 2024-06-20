import { MigrationInterface, QueryRunner } from 'typeorm';
import { travelSeeds } from './seeds/travels';

export class Migrations1718894424083 implements MigrationInterface {
  name = 'Migrations1718894424083';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "travel_booking" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "confirmed" boolean NOT NULL, "client" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "travelUuid" uuid, CONSTRAINT "PK_43f2e2581834cc16e9259bedeff" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "travel" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "startingDate" TIMESTAMP NOT NULL, "endingDate" TIMESTAMP NOT NULL, "price" integer NOT NULL, "moods" text NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_07a7b0c3f52ff8f1cf79e1f14a2" UNIQUE ("slug"), CONSTRAINT "PK_27aee889d4801812aa0c20dfdc3" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "travel_booking" ADD CONSTRAINT "FK_d3c5a034e3d57f986b412cddab0" FOREIGN KEY ("travelUuid") REFERENCES "travel"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // in real world app seeds need to be done elsewhere and not in the migrations
    for (const seed of travelSeeds) {
      await queryRunner.query(
        `INSERT INTO travel (slug, name, description, "startingDate", "endingDate", price, moods) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          seed.slug,
          seed.name,
          seed.description,
          new Date(seed.startingDate).toISOString(),
          new Date(seed.endingDate).toISOString(),
          seed.price,
          seed.moods,
        ],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "travel_booking" DROP CONSTRAINT "FK_d3c5a034e3d57f986b412cddab0"`,
    );
    await queryRunner.query(`DROP TABLE "travel"`);
    await queryRunner.query(`DROP TABLE "travel_booking"`);
  }
}
