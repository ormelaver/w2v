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
    const response = await request(app).patch('/api/cars').send({
      cid: 1,
      new_price: 200,
    });
    expect(response.status).toBe(200);
  });

  it('should fail because car does not exist', async () => {
    const response = await request(app).patch('/api/cars').send({
      cid: 50,
      new_price: 200,
    });
    expect(response.status).toBe(400);
  });
});
