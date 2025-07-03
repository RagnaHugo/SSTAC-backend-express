const express = require('express');
const router = express.Router();

// Importar rutas específicas
const desarrolladoresRoutes = require('./desarrolladores');
const tareasRoutes = require('./tareas');
const metricasRoutes = require('./metricas');

// Usar las rutas
router.use('/desarrolladores', desarrolladoresRoutes);
router.use('/tareas', tareasRoutes);
router.use('/metricas', metricasRoutes);

// Ruta de salud del API
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'SSTAC API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;