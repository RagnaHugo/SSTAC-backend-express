const cors = require('cors');

// Configuración CORS más permisiva para debugging
const corsOptions = {
  origin: function (origin, callback) {
    console.log('🌐 CORS - Origen:', origin);
    
    // Permitir TODOS los orígenes mientras debuggeamos
    callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
  allowedHeaders: [
    'Accept',
    'Accept-Language',
    'Content-Language',
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Origin',
    'DNT',
    'User-Agent',
    'If-Modified-Since',
    'Cache-Control',
    'Range'
  ],
  exposedHeaders: ['Content-Length', 'Content-Range']
};

module.exports = cors(corsOptions);