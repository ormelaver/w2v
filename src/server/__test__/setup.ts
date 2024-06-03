import { Mysql } from '../services/mysql';
import { tables } from '../services/tables';
import 'dotenv/config';

const orders = [
  {
    cid: 1,
    uid: 1,
    date_from: '2024-06-10',
    date_to: '2024-06-25',
  },
  {
    cid: 2,
    uid: 1,
    date_from: '2024-06-28',
    date_to: '2024-06-30',
  },
];

const cars = [
  {
    model: 'Tesla',
    size: 'medium',
    price_per_day: '100',
  },
  {
    model: 'BMW',
    size: 'small',
    price_per_day: '80',
  },
  {
    model: 'Toyota',
    size: 'large',
    price_per_day: '70',
  },
  {
    model: 'Skoda',
    size: 'medium',
    price_per_day: '60',
  },
];

let sql: any;
export const setupDB = async () => {
  sql = await Mysql.getInstance();

  for (let i = 0; i < tables.length; i++) {
    // await sql.dropTable(tables[i].tableName);
    await sql.createTable(
      tables[i].tableName,
      tables[i].columns,
      tables[i].primaryKeys
    );
  }

  await sql.addCars(cars);

  await sql.addUser(true);
  await sql.addUser();
  for (let i = 0; i < orders.length; i++) {
    await sql.addOrder(
      orders[i].cid,
      orders[i].uid,
      orders[i].date_from,
      orders[i].date_to
    );
  }
  console.log('Test database setup complete');
};

export const cleanDB = async () => {
  if (sql) {
    await sql.setForeginKeyCheck(false);
    await sql.cleanTable('cars');
    await sql.cleanTable('orders');
    await sql.cleanTable('users');
    await sql.setForeginKeyCheck(true);
    await sql.stop();
  }
};
