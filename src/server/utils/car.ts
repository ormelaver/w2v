import { Mysql } from '../services/mysql';
import { CarType, Size } from '../types/Car';

export class Car {
  private sql: Mysql;
  constructor(sql: Mysql) {
    this.sql = sql;
  }

  static async init() {
    const sql = await Mysql.getInstance();
    return new Car(sql);
  }

  public async getAllCars() {
    try {
      const cars = await this.sql.getAllRows('cars', ['*']);
      return cars;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async deleteCar(cid: number) {
    try {
      await this.sql.deleteRow(cid, 'cars', 'cid');

      return { message: 'car deleted successfully' };
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async getCarById(cid: number) {
    const car = await this.sql.getRowsByEqualCondition(
      'cars',
      ['cid'],
      'cid',
      cid
    );

    return car;
  }
  public async filterCarsBySize(size: Size) {
    try {
      const cars = await this.sql.getRowsByEqualCondition(
        'cars',
        ['*'],
        'size',
        size
      );

      return cars;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async getCarsAvailableInDateRange(date_from: string, date_to: string) {
    const rows = await this.sql.getCarsByDateRange(date_from, date_to);
    return rows;
  }

  public async addCar(cars: CarType[]) {
    try {
      await this.sql.addCars(cars);
      return { message: 'car saved successfully' };
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async updatePrice(cid: number, new_price: number) {
    try {
      this.sql.updateValue('cars', 'cid', cid, 'price_per_day', new_price);
      return { message: 'price updated successfully' };
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
