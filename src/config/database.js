const knex = require('knex');
const path = require('path');

// Configuración condicional: PostgreSQL para producción, SQLite para desarrollo
const config = {
  // Configuración para producción (PostgreSQL)
  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } // Requerido para Render
    },
    pool: {
      min: 0,
      max: 10
    },
    migrations: {
      directory: path.join(__dirname, '../migrations'),
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: path.join(__dirname, '../seeds')
    }
  },
  
  // Configuración para desarrollo (SQLite)
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
    }
  }
};

// Seleccionar configuración según el entorno
const environment = process.env.NODE_ENV || 'development';
const selectedConfig = config[environment];

console.log(`📊 Configurando base de datos para entorno: ${environment}`);
console.log(`🔧 Cliente de BD: ${selectedConfig.client}`);

const db = knex(selectedConfig);

// Función para testear la conexión
async function testConnection() {
  try {
    await db.raw('SELECT 1');
    console.log(`✅ Conexión exitosa a ${selectedConfig.client}`);
  } catch (error) {
    console.error(`❌ Error conectando a ${selectedConfig.client}:`, error.message);
    throw error;
  }
}

// Función para cerrar la conexión
async function closeConnection() {
  await db.destroy();
  console.log('🔄 Conexión a base de datos cerrada');
}

// Ejecutar test de conexión
testConnection().catch(console.error);

// Exportar tanto la conexión como las funciones utilitarias
module.exports = {
  db,
  testConnection,
  closeConnection
};

// Para compatibilidad con tu código existente, exportar db como default
module.exports.default = db;