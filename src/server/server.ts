import { app } from './app';
import { Mysql } from './services/mysql';
import 'dotenv/config';

import { tables } from './services/tables';

const PORT = process.env.PORT;

const start = async () => {
  const sql = await Mysql.getInstance();

  for (let i = 0; i < tables.length; i++) {
    await sql.createTable(
      tables[i].tableName,
      tables[i].columns,
      tables[i].primaryKeys
    );
  }
  console.log('connected to MySql database');

  app.listen(PORT, () => {
    console.log('server listening on port ' + PORT);
  });
};

start();
