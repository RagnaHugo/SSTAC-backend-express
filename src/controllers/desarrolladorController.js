const Desarrollador = require('../models/Desarrollador');
const { validationResult } = require('express-validator');

const desarrolladorController = {
  // GET /api/desarrolladores
  async getAll(req, res) {
    try {
      const desarrolladores = await Desarrollador.getAll();
      res.json(desarrolladores);
    } catch (error) {
      res.status(500).json({ 
        error: 'Error al obtener desarrolladores',
        details: error.message 
      });
    }
  },

  // GET /api/desarrolladores/:id
  async getById(req, res) {
    try {
      const { id } = req.params;
      const desarrollador = await Desarrollador.getById(id);
      
      if (!desarrollador) {
        return res.status(404).json({ error: 'Desarrollador no encontrado' });
      }
      
      res.json(desarrollador);
    } catch (error) {
      res.status(500).json({ 
        error: 'Error al obtener desarrollador',
        details: error.message 
      });
    }
  },

  // POST /api/desarrolladores
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const desarrollador = await Desarrollador.create(req.body);
      res.status(201).json(desarrollador);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }
      res.status(500).json({ 
        error: 'Error al crear desarrollador',
        details: error.message 
      });
    }
  },

  // PUT /api/desarrolladores/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const desarrollador = await Desarrollador.update(id, req.body);
      res.json(desarrollador);
    } catch (error) {
      res.status(500).json({ 
        error: 'Error al actualizar desarrollador',
        details: error.message 
      });
    }
  },

  // DELETE /api/desarrolladores/:id
  async delete(req, res) {
    try {
      const { id } = req.params;
      await Desarrollador.delete(id);
      res.json({ message: 'Desarrollador desactivado exitosamente' });
    } catch (error) {
      res.status(500).json({ 
        error: 'Error al desactivar desarrollador',
        details: error.message 
      });
    }
  }
};

module.exports = desarrolladorController;