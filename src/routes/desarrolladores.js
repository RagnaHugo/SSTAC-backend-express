const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const desarrolladorController = require('../controllers/desarrolladorController');

// Validaciones
const validateDesarrollador = [
  body('nombre')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('email')
    .isEmail()
    .withMessage('Debe proporcionar un email válido'),
  body('es_lider')
    .optional()
    .isBoolean()
    .withMessage('es_lider debe ser un valor booleano')
];

// Rutas
router.get('/', desarrolladorController.getAll);
router.get('/:id', desarrolladorController.getById);
router.post('/', validateDesarrollador, desarrolladorController.create);
router.put('/:id', validateDesarrollador, desarrolladorController.update);
router.delete('/:id', desarrolladorController.delete);

module.exports = router;