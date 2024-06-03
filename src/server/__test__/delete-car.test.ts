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

describe('test suite for /delete-car route', () => {
  it('should delete the car from DB', async () => {
    const response = await request(app).delete('/api/cars/1');
    expect(response.status).toBe(200);
  });

  it('should fail because car does not exist', async () => {
    const response = await request(app).delete('/api/cars/50');
    expect(response.status).toBe(400);
  });
});
