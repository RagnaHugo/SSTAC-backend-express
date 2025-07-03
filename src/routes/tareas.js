const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const tareaController = require('../controllers/tareaController');

// Validaciones para tareas
const validateTarea = [
  body('titulo')
    .isLength({ min: 1, max: 200 })
    .withMessage('El título debe tener entre 1 y 200 caracteres'),
  body('descripcion')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder 500 caracteres'),
  body('desarrollador_id')
    .isInt({ min: 1 })  // ← CAMBIO AQUÍ
    .withMessage('ID de desarrollador debe ser un número entero válido')
];

// Rutas para tareas
router.get('/', tareaController.getAll);
router.get('/completadas', tareaController.getCompletadas);
router.get('/:id', tareaController.getById);
router.post('/', validateTarea, tareaController.create);
router.put('/:id', validateTarea, tareaController.update);
router.delete('/:id', tareaController.delete);

module.exports = router;