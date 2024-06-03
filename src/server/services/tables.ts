export const tables = [
  {
    tableName: 'cars',
    columns: [
      'cid int(11) NOT NULL AUTO_INCREMENT',
      'model varchar(255) DEFAULT NULL',
      'size ENUM("small", "medium", "large")',
      'price_per_day DECIMAL(10, 2)',
    ],
    primaryKeys: ['cid'],
  },
  {
    tableName: 'users',
    columns: [
      'uid int(11) NOT NULL AUTO_INCREMENT',
      'isAdmin boolean DEFAULT FALSE',
    ],
    primaryKeys: ['uid'],
  },
  {
    tableName: 'orders',
    columns: [
      'oid int(11) NOT NULL AUTO_INCREMENT',
      'cid int(11) NOT NULL',
      'uid int(11) NOT NULL',
      'date_from date NOT NULL',
      'date_to date NOT NULL',
      'FOREIGN KEY (cid) REFERENCES cars(cid)',
      'FOREIGN KEY (uid) REFERENCES users(uid)',
    ],
    primaryKeys: ['oid'],
  },
];
