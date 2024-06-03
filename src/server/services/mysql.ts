import mysql, { Connection } from 'mysql2/promise';
import { CarType } from '../types/Car';

export class Mysql {
  //connection.execute instead of connection.query?
  private static instance: Mysql;
  private connection: any;
  private isConnected: boolean = false;

  private constructor() {}

  public static async getInstance(): Promise<any> {
    if (!Mysql.instance) {
      Mysql.instance = new Mysql();
      await Mysql.instance.init();
    }
    return Mysql.instance;
  }

  public async createTable(
    tableName: string,
    columnNames: string[],
    primaryKeys: string[]
  ): Promise<void> {
    const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${[
      ...columnNames,
    ]} ${primaryKeys ? `,PRIMARY KEY (${primaryKeys})` : ')'})`;

    try {
      await this.connection.query(query);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async getAllRows(
    tableName: string,
    columnNames: string[],
    groupBy?: string
  ) {
    const query = `SELECT ${[...columnNames]} FROM ${tableName} ${
      groupBy ? `GROUP BY ${groupBy}` : ''
    }`;

    try {
      const [cars] = await this.connection.query(query);

      if (cars.length > 0) {
        return cars;
      } else {
        return [];
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async getRowsByEqualCondition(
    tableName: string,
    columnNames: string[],
    columnName: string,
    columnValue: string | number
  ) {
    const query = `SELECT ${[
      ...columnNames,
    ]} FROM ${tableName} WHERE ${columnName}='${columnValue}'`;

    try {
      const [rows] = await this.connection.query(query);

      if (rows.length > 0) {
        return rows;
      } else {
        return [];
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async getCarsByDateRange(date_from: string, date_to: string) {
    const [rows] = await this.connection.query(
      `
    SELECT cars.cid, model, size
    FROM cars
    LEFT JOIN orders ON cars.cid = orders.cid
    WHERE orders.cid IS NULL
    OR (orders.date_to < ? OR orders.date_from > ?)
  `,
      [date_from, date_to]
    );

    return rows;
  }

  public async addOrder(
    cid: number,
    uid: number,
    date_from: string,
    date_to: string
  ) {
    const query = `INSERT INTO orders (cid, uid, date_from, date_to) VALUES (${cid}, ${uid}, '${date_from}','${date_to}')`;

    try {
      await this.connection.query(query);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async addCars(cars: CarType[]) {
    const query = `INSERT INTO cars (model, size, price_per_day) VALUES ?`;

    const values = [
      cars.map((car) => {
        return [car.model, car.size, car.price_per_day];
      }),
    ];

    try {
      await this.connection.query(query, values);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async deleteRow(id: number, tableName: string, columnName: string) {
    const query = `DELETE FROM ${tableName} WHERE ${columnName} = ${id}`;

    try {
      await this.connection.query(query);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async updateValue(
    tableName: string,
    idColumnName: string,
    id: number,
    valueColumnName: string,
    newValue: any
  ) {
    const query = `UPDATE ${tableName} SET ${valueColumnName} = ${newValue} WHERE ${idColumnName}=${id}`;

    try {
      await this.connection.query(query);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async stop() {
    await this.connection.end();
  }

  public async cleanTable(tableName: string) {
    const query = `TRUNCATE TABLE ${tableName}`;

    try {
      await this.connection.query(query);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async addUser(isAdmin: boolean) {
    const query = `INSERT INTO users (isAdmin) VALUES (${isAdmin})`;

    try {
      await this.connection.query(query);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async setForeginKeyCheck(check: boolean) {
    const query = `SET FOREIGN_KEY_CHECKS = ${check ? '1' : '0'}`;

    try {
      await this.connection.query(query);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  private async init() {
    let database;
    if (process.env.NODE_ENV === 'test') {
      database = process.env.MYSQL_TEST_DATABASE;
    } else {
      database = process.env.MYSQL_DATABASE;
    }

    try {
      this.connection = await mysql.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_ROOT_USER,
        password: process.env.MYSQL_PASSWORD,
        database,
      });
      this.isConnected = true;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
