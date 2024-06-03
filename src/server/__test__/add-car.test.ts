import request from 'supertest';
import { app } from '../app';

import 'dotenv/config';

import { setupDB, cleanDB } from './setup';

beforeAll(async () => {
  await setupDB();
});
afterAll(async () => {
  await cleanDB();
}, 60000);

describe('test suite for /add-car route', () => {
  it('should add an order to the DB', async () => {
    const response = await request(app)
      .post('/api/cars')
      .send({
        uid: 1,
        cars: [
          {
            model: 'Audi',
            size: 'M',
            price_per_day: 100,
          },
        ],
      });
    expect(response.status).toBe(201);
  });

  it('should fail because size is faulty', async () => {
    const response = await request(app)
      .post('/api/cars')
      .send({
        uid: 1,
        cars: [
          {
            model: 'Audi',
            price_per_day: 100,
          },
        ],
      });
    expect(response.status).toBe(400);
  });

  it('should fail because user does not exist', async () => {
    const response = await request(app)
      .post('/api/cars')
      .send({
        uid: 5,
        cars: [
          {
            model: 'Audi',
            size: 'M',
            price_per_day: 100,
          },
        ],
      });
    expect(response.status).toBe(400);
  });

  it('should fail because user is not an admin', async () => {
    const response = await request(app)
      .post('/api/cars')
      .send({
        uid: 2,
        cars: [
          {
            model: 'Audi',
            size: 'M',
            price_per_day: 100,
          },
        ],
      });
    expect(response.status).toBe(400);
  });
});
