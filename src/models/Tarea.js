const db = require('../config/database');

class Tarea {
  static async getAll() {
    return await db('tareas as t')
      .leftJoin('desarrolladores as d', 't.desarrollador_id', 'd.id')
      .select(
        't.*',
        'd.nombre as desarrollador_nombre'
      )
      .orderBy('t.fecha_creacion', 'desc');
  }

  static async getActivas() {
    return await db('tareas as t')
      .leftJoin('desarrolladores as d', 't.desarrollador_id', 'd.id')
      .select(
        't.*',
        'd.nombre as desarrollador_nombre'
      )
      .whereNot('t.estado', 'completada')
      .orderBy('t.fecha_creacion', 'desc');
  }

  static async getCompletadas(limit = 50) {
    return await db('tareas as t')
      .leftJoin('desarrolladores as d', 't.desarrollador_id', 'd.id')
      .select(
        't.*',
        'd.nombre as desarrollador_nombre'
      )
      .where('t.estado', 'completada')
      .orderBy('t.fecha_completada', 'desc')
      .limit(limit);
  }

  static async getById(id) {
    return await db('tareas as t')
      .leftJoin('desarrolladores as d', 't.desarrollador_id', 'd.id')
      .select(
        't.*',
        'd.nombre as desarrollador_nombre'
      )
      .where('t.id', id)
      .first();
  }

  static async create(data) {
    const [id] = await db('tareas').insert(data);
    return await this.getById(id);
  }

  static async updateEstado(id, estadoData) {
    const tarea = await this.getById(id);
    if (!tarea) throw new Error('Tarea no encontrada');

    const updateData = { estado: estadoData.estado };
    const now = new Date();

    // Actualizar timestamps según el estado
    switch (estadoData.estado) {
      case 'codificando':
        if (!tarea.fecha_inicio_codificacion) {
          updateData.fecha_inicio_codificacion = now;
        }
        break;
      case 'en_pruebas':
        updateData.fecha_envio_pruebas = now;
        break;
      case 're_trabajo':
        updateData.fecha_inicio_retrabajo = now;
        if (tarea.estado === 'en_pruebas') {
          updateData.ciclos_retrabajo = (tarea.ciclos_retrabajo || 0) + 1;
        }
        break;
      case 'completada':
        updateData.fecha_completada = now;
        // Calcular tiempo total
        if (tarea.fecha_creacion) {
          const inicio = new Date(tarea.fecha_creacion);
          const fin = now;
          updateData.tiempo_total_dias = (fin - inicio) / (1000 * 60 * 60 * 24);
        }
        break;
    }

    await db('tareas').where('id', id).update(updateData);
    
    // Registrar en historial
    await db('historial_tareas').insert({
      tarea_id: id,
      estado_anterior: tarea.estado,
      estado_nuevo: estadoData.estado,
      comentarios: estadoData.comentarios,
      usuario_id: estadoData.usuario_id
    });

    return await this.getById(id);
  }

  static async updateChecklist(id, checklistData) {
    await db('tareas')
      .where('id', id)
      .update({
        checklist_data: JSON.stringify(checklistData.checklist),
        checklist_completado: checklistData.completado
      });

    return await this.getById(id);
  }
}

module.exports = Tarea;