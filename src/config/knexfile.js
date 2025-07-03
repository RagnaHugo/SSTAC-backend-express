const path = require('path');
require('dotenv').config();

module.exports = {
  development: {
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
    },
    pool: {
      afterCreate: (conn, cb) => {
        conn.run('PRAGMA foreign_keys = ON', cb);
      }
    }
  },
  
  testing: {
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, '../migrations')
    },
    seeds: {
      directory: path.join(__dirname, '../seeds')
    }
  },
  
  production: {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, '../../database/sstac_prod.db')
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, '../migrations')
    },
    pool: {
      min: 2,
      max: 10,
      afterCreate: (conn, cb) => {
        conn.run('PRAGMA foreign_keys = ON', cb);
      }
    }
  }
};