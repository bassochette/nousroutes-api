import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getTestingApp } from './utils/get-testing-app';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await getTestingApp();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect({
      status: 'ok',
    });
  });
});
