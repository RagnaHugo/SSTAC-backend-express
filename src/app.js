const express = require('express');
const path = require('path');
require('dotenv').config();

// Middleware imports
const helmet = require('helmet');
const compression = require('compression');
const corsConfig = require('./middleware/corsConfig');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Routes imports
const apiRoutes = require('./routes/index');

// Inicializar Express
const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS - DEBE IR PRIMERO Y SOLO UNA VEZ
app.use(corsConfig);

// Middleware básico
app.use(compression());
app.use(logger);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos (para el frontend)
app.use(express.static(path.join(__dirname, '../public')));



app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});


// Rutas de API
app.use('/api', apiRoutes);

// Ruta raíz - Servir el frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Ruta para seed de datos (solo en desarrollo)
if (process.env.NODE_ENV !== 'production') {
  app.post('/api/seed', async (req, res) => {
    try {
      const knex = require('./config/database');
      
      // Ejecutar seeds
      await knex.seed.run();
      
      res.json({ 
        message: 'Datos de ejemplo creados exitosamente',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error creando datos de ejemplo:', error);
      res.status(500).json({ 
        error: 'Error al crear datos de ejemplo',
        details: error.message 
      });
    }
  });
}

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe en este servidor`
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Inicializar servidor
const server = app.listen(PORT, async () => {
  console.log(`🚀 Servidor SSTAC iniciado en puerto ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔗 API Health: http://localhost:${PORT}/api/health`);
  console.log(`📝 Entorno: ${process.env.NODE_ENV || 'development'}`);
  
  // Verificar conexión a base de datos
  try {
    const db = require('./config/database');
    await db.raw('SELECT 1');
    console.log('✅ Conexión a base de datos exitosa');
  } catch (error) {
    console.error('❌ Error conectando a base de datos:', error.message);
  }
});

// Manejo graceful de cierre del servidor
process.on('SIGTERM', () => {
  console.log('🛑 Recibido SIGTERM, cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado exitosamente');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Recibido SIGINT, cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado exitosamente');
    process.exit(0);
  });
});

module.exports = app;