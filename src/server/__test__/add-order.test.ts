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

describe('test suite for /add-order route', () => {
  it('should add an order to the DB', async () => {
    const response = await request(app).post('/api/orders').send({
      cid: 1,
      uid: 1,
      date_from: '2024-06-10',
      date_to: '2024-06-25',
    });
    expect(response.status).toBe(201);
  });

  it('should fail because user does not exist', async () => {
    const response = await request(app).post('/api/orders').send({
      cid: 1,
      uid: 100,
      date_from: '2024-06-10',
      date_to: '2024-06-25',
    });
    expect(response.status).toBe(400);
  });

  it('should fail with 400 as date_from > date_to', async () => {
    const response = await request(app).get(
      '/api/cars/by-date?date_from=2024-07-20&date_to=2024-07-15'
    );
    expect(response.status).toBe(400);
  });
});
