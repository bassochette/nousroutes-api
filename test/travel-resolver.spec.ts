import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getTestingApp } from './utils/get-testing-app';
import { Repository } from 'typeorm';
import { Travel } from '../src/travel/entities/travel.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TravelResolver (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await getTestingApp();
  });

  it('find all travels', async () => {
    const { body, status } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          {
            travel {
              uuid,
              name,
              description,
              availableSeats,
              moods {
                nature
              }
            }
          }
        `,
      });

    expect(status).toBe(200);
    expect(body.data.travel.length).toBe(3);
  });

  describe('book reservation mutation', () => {
    let travels: Travel[];
    beforeEach(async () => {
      const travelRepo = app.get<Repository<Travel>>(
        getRepositoryToken(Travel),
      );
      travels = await travelRepo.find({});
    });

    it('simple no error booking', async () => {
      const bookingReservationInput = {
        travelUuid: travels[0].uuid,
        email: 'julien@webeleon.dev',
        seats: 3,
      };

      const { body, status } = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
          mutation {
            bookingReservation(
              bookingReservationInput: {
                travelUuid: "${bookingReservationInput.travelUuid}",
                email: "${bookingReservationInput.email}",
                seats: ${bookingReservationInput.seats}
              }
            ) {
              uuid,
              travel {
                uuid
              },
              confirmed,
              createdAt
            }
          }
        `,
        });

      expect(status).toBe(200);
      expect(body.data).toBeDefined();
      expect(body.data.bookingReservation).toBeDefined();
      expect(body.data.bookingReservation.uuid).toBeDefined();
      expect(body.data.bookingReservation.createdAt).toBeDefined();
      expect(body.data.bookingReservation.confirmed).toBe(false);
    });
  });
});
