import { Mysql } from '../services/mysql';

export class Order {
  private sql: Mysql;
  constructor(sql: Mysql) {
    this.sql = sql;
  }

  static async init() {
    const sql = await Mysql.getInstance();
    return new Order(sql);
  }

  public async addOrder(
    cid: number,
    uid: number,
    date_from: string,
    date_to: string
  ) {
    try {
      await this.sql.addOrder(cid, uid, date_from, date_to);
      return { message: 'order saved successfully' };
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
