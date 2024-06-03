import request from 'supertest';
import { app } from '../app';

import { setupDB, cleanDB } from './setup';

beforeAll(async () => {
  await setupDB();
});
afterAll(async () => {
  await cleanDB();
}, 60000);

describe('test suite for /get-cars and /cars-size routes', () => {
  it('should return all cars and status 200', async () => {
    const response = await request(app).get('/api/cars');
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(4);
  });

  it('should return only cars with size medium', async () => {
    const response = await request(app).get('/api/cars/by-size?size=medium');
    expect(response.status).toBe(200);
    expect(response.body[0].size).toEqual('medium');
    expect(response.body[1].size).toEqual('medium');
    expect(response.body.length).toEqual(2);
  });

  it('should fail with error code 400 (Size must be one of small, medium, large)', async () => {
    const response = await request(app).get('/api/cars/by-size?size=medi');
    expect(response.status).toBe(400);
  });

  it('should fail with error code 400 (size is required)', async () => {
    const response = await request(app).get('/api/cars/by-size');
    expect(response.status).toBe(400);
  });
});
