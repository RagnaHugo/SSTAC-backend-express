const express = require('express');
const router = express.Router();
const metricasController = require('../controllers/metricasController');

router.get('/', metricasController.getMetricas);
router.get('/historial/:tareaId', metricasController.getHistorialTarea);

module.exports = router;