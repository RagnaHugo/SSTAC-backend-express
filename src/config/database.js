const knex = require('knex');
const path = require('path');

const config = {
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, '../../database/sstac_dev.db')
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.join(__dirname, '../migrations')
  },
  seeds: {
    directory: path.join(__dirname, '../seeds')
  }
};

const db = knex(config);

module.exports = db;