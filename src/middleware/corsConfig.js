const cors = require('cors');

const corsOptions = {
  origin: function (origin, callback) {
    console.log('🌐 Origen recibido:', origin);
    
    // Permitir requests sin origin (apps móviles, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      "https://spiffy-peony-c702bd.netlify.app", // Tu frontend en Netlify
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5000",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5000"
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('✅ Origen permitido:', origin);
      callback(null, true);
    } else {
      console.log('❌ Origen rechazado:', origin);
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
};

module.exports = cors(corsOptions);