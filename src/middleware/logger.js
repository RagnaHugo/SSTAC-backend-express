const morgan = require('morgan');

// Formato personalizado para logs
const logFormat = process.env.NODE_ENV === 'production' 
  ? 'combined' 
  : ':method :url :status :res[content-length] - :response-time ms';

const logger = morgan(logFormat, {
  // Solo logear errores en producción
  skip: function (req, res) {
    return process.env.NODE_ENV === 'production' && res.statusCode < 400;
  }
});

module.exports = logger;