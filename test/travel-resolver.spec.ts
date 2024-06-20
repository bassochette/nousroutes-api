import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getTestingApp } from './utils/get-testing-app';

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
});
