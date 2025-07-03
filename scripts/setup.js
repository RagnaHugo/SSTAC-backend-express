#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Configurando SSTAC...\n');

// Crear directorio de base de datos
const dbDir = path.join(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log('✅ Directorio de base de datos creado');
}

// Crear directorio público para frontend
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log('✅ Directorio público creado');
}

// Ejecutar migraciones
try {
  console.log('🔄 Ejecutando migraciones...');
  execSync('npx knex migrate:latest --knexfile src/config/knexfile.js', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  console.log('✅ Migraciones completadas');
} catch (error) {
  console.error('❌ Error en migraciones:', error.message);
  process.exit(1);
}

// Ejecutar seeds
try {
  console.log('🔄 Insertando datos de ejemplo...');
  execSync('npx knex seed:run --knexfile src/config/knexfile.js', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  console.log('✅ Datos de ejemplo insertados');
} catch (error) {
  console.error('❌ Error insertando datos:', error.message);
  process.exit(1);
}

console.log('\n🎉 ¡SSTAC configurado exitosamente!');
console.log('\nPara iniciar el servidor:');
console.log('  npm run dev    (modo desarrollo)');
console.log('  npm start      (modo producción)');
console.log('\nEl servidor estará disponible en: http://localhost:5000');