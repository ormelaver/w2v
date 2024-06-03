import request from 'supertest';
import { app } from '../app';

import { setupDB, cleanDB } from './setup';

beforeAll(async () => {
  await setupDB();
});
afterAll(async () => {
  await cleanDB();
}, 60000);
// import { Mysql } from '../services/mysql';
// import { tables } from '../services/tables';
// import 'dotenv/config';

// const orders = [
//   {
//     cid: 1,
//     uid: 1,
//     date_from: '2024-06-10',
//     date_to: '2024-06-25',
//   },
//   {
//     cid: 2,
//     uid: 1,
//     date_from: '2024-06-28',
//     date_to: '2024-06-30',
//   },
// ];
// let sql: any;
// beforeAll(async () => {
//   sql = await Mysql.getInstance();

//   for (let i = 0; i < tables.length; i++) {
//     // await sql.dropTable(tables[i].tableName);
//     await sql.createTable(
//       tables[i].tableName,
//       tables[i].columns,
//       tables[i].primaryKeys
//     );
//   }

//   await sql.addCars([
//     {
//       model: 'Tesla',
//       size: 'medium',
//       price_per_day: '100',
//     },
//     {
//       model: 'BMW',
//       size: 'small',
//       price_per_day: '80',
//     },
//     {
//       model: 'Toyota',
//       size: 'large',
//       price_per_day: '70',
//     },
//     {
//       model: 'Skoda',
//       size: 'medium',
//       price_per_day: '60',
//     },
//   ]);

//   await sql.addUser(true);
//   for (let i = 0; i < orders.length; i++) {
//     await sql.addOrder(
//       orders[i].cid,
//       orders[i].uid,
//       orders[i].date_from,
//       orders[i].date_to
//     );
//   }
//   console.log('Test database setup complete');
// });

// afterAll(async () => {
//   if (sql) {
//     await sql.setForeginKeyCheck(false);
//     await sql.cleanTable('cars');
//     await sql.cleanTable('orders');
//     await sql.cleanTable('users');
//     await sql.setForeginKeyCheck(true);
//     await sql.stop();
//   }
// }, 60000);

describe('test suite for /cars-available route', () => {
  it('should return all available cars in the given dates', async () => {
    const response = await request(app).get(
      '/api/cars/by-date?date_from=2024-06-20&date_to=2024-06-25'
    );
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(3);
  });

  it('should return all cars (no car is ordered to these dates)', async () => {
    const response = await request(app).get(
      '/api/cars/by-date?date_from=2024-07-20&date_to=2024-07-25'
    );
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(4);
  });

  it('should fail with 400 as date_from > date_to', async () => {
    const response = await request(app).get(
      '/api/cars/by-date?date_from=2024-07-20&date_to=2024-07-15'
    );
    expect(response.status).toBe(400);
  });
});
