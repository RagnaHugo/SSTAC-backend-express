const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Error de validación de Knex/SQLite
  if (err.code === 'SQLITE_CONSTRAINT') {
    return res.status(400).json({
      error: 'Error de validación en base de datos',
      details: err.message
    });
  }

  // Error de sintaxis JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'JSON malformado',
      details: 'Verifique la sintaxis del JSON enviado'
    });
  }

  // Error genérico del servidor
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;