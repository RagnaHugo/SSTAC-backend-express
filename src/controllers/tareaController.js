const Tarea = require('../models/Tarea');
const { validationResult } = require('express-validator');

const tareaController = {
  // GET /api/tareas
  async getAll(req, res) {
    try {
      const tareas = await Tarea.getActivas();
      res.json(tareas);
    } catch (error) {
      res.status(500).json({ 
        error: 'Error al obtener tareas',
        details: error.message 
      });
    }
  },

  // GET /api/tareas/completadas
  async getCompletadas(req, res) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 50;
      const tareas = await Tarea.getCompletadas(limit);
      res.json(tareas);
    } catch (error) {
      res.status(500).json({ 
        error: 'Error al obtener tareas completadas',
        details: error.message 
      });
    }
  },

  // GET /api/tareas/:id
  async getById(req, res) {
    try {
      const { id } = req.params;
      const tarea = await Tarea.getById(id);
      
      if (!tarea) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
      }
      
      res.json(tarea);
    } catch (error) {
      res.status(500).json({ 
        error: 'Error al obtener tarea',
        details: error.message 
      });
    }
  },

  // POST /api/tareas
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const tarea = await Tarea.create(req.body);
      
      // Registrar en historial
      const db = require('../config/database');
      await db('historial_tareas').insert({
        tarea_id: tarea.id,
        estado_anterior: null,
        estado_nuevo: 'pendiente',
        comentarios: 'Tarea creada',
        usuario_id: req.body.usuario_id
      });

      res.status(201).json(tarea);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({ error: 'El código de tarea ya existe' });
      }
      res.status(500).json({ 
        error: 'Error al crear tarea',
        details: error.message 
      });
    }
  },

  // PUT /api/tareas/:id/estado
  async updateEstado(req, res) {
    try {
      const { id } = req.params;
      const tarea = await Tarea.updateEstado(id, req.body);
      res.json(tarea);
    } catch (error) {
      if (error.message === 'Tarea no encontrada') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ 
        error: 'Error al actualizar estado de tarea',
        details: error.message 
      });
    }
  },

  // PUT /api/tareas/:id/checklist
  async updateChecklist(req, res) {
    try {
      const { id } = req.params;
      const tarea = await Tarea.updateChecklist(id, req.body);
      res.json(tarea);
    } catch (error) {
      res.status(500).json({ 
        error: 'Error al actualizar checklist',
        details: error.message 
      });
    }
  }
};

module.exports = tareaController;