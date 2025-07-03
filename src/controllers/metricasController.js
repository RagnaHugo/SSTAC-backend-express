const db = require('../config/database');

const metricasController = {
  // GET /api/metricas
  async getMetricas(req, res) {
    try {
      // 1. Tareas por estado
      const tareasPorEstado = await db('tareas')
        .select('estado')
        .count('* as cantidad')
        .groupBy('estado');

      const estadosObj = {};
      tareasPorEstado.forEach(item => {
        estadosObj[item.estado] = item.cantidad;
      });

      // Asegurar que todos los estados estén presentes
      const estadosCompletos = {
        pendiente: estadosObj.pendiente || 0,
        codificando: estadosObj.codificando || 0,
        en_pruebas: estadosObj.en_pruebas || 0,
        re_trabajo: estadosObj.re_trabajo || 0,
        completada: estadosObj.completada || 0
      };

      // 2. Métricas de tareas completadas (últimos 30 días)
      const hace30Dias = new Date();
      hace30Dias.setDate(hace30Dias.getDate() - 30);

      const tareasRecientes = await db('tareas')
        .where('fecha_completada', '>=', hace30Dias.toISOString())
        .where('estado', 'completada')
        .select('tiempo_total_dias', 'ciclos_retrabajo');

      let tiempoPromedioTotal = 0;
      let tasaRetrabajo = 0;
      let promedioRetrabajos = 0;
      let totalTareasCompletadas = tareasRecientes.length;

      if (tareasRecientes.length > 0) {
        // Tiempo promedio
        const tiemposValidos = tareasRecientes
          .filter(t => t.tiempo_total_dias != null)
          .map(t => t.tiempo_total_dias);
        
        if (tiemposValidos.length > 0) {
          tiempoPromedioTotal = tiemposValidos.reduce((sum, time) => sum + time, 0) / tiemposValidos.length;
        }

        // Tasa de re-trabajo
        const tareasConRetrabajo = tareasRecientes.filter(t => t.ciclos_retrabajo > 0).length;
        tasaRetrabajo = (tareasConRetrabajo / tareasRecientes.length) * 100;

        // Promedio de re-trabajos
        const totalRetrabajos = tareasRecientes.reduce((sum, t) => sum + (t.ciclos_retrabajo || 0), 0);
        promedioRetrabajos = totalRetrabajos / tareasRecientes.length;
      }

      // 3. Cálculo de utilización del sistema (según tu informe)
      const desarrolladoresActivos = await db('desarrolladores')
        .where('activo', true)
        .count('* as count')
        .first();

      const servidoresActivos = desarrolladoresActivos.count;
      const lambdaLlegadas = 0.6; // 3 tareas/semana ÷ 5 días
      const muServicio = 0.222;   // 1 tarea ÷ 4.5 días promedio

      let utilizacionSistema = 0;
      let sistemaEstable = false;

      if (servidoresActivos > 0) {
        utilizacionSistema = lambdaLlegadas / (servidoresActivos * muServicio);
        sistemaEstable = utilizacionSistema < 1.0;
      }

      const metricas = {
        tareas_por_estado: estadosCompletos,
        tiempo_ciclo_promedio: Math.round(tiempoPromedioTotal * 100) / 100,
        tasa_retrabajo: Math.round(tasaRetrabajo * 10) / 10,
        ciclos_retrabajo_promedio: Math.round(promedioRetrabajos * 100) / 100,
        utilizacion_sistema: Math.round(utilizacionSistema * 1000) / 1000,
        sistema_estable: sistemaEstable,
        total_tareas_completadas: totalTareasCompletadas,
        desarrolladores_activos: servidoresActivos,
        
        // Parámetros de teoría de colas para referencia
        parametros_colas: {
          lambda: lambdaLlegadas,
          mu: muServicio,
          servidores: servidoresActivos
        }
      };

      res.json(metricas);
    } catch (error) {
      res.status(500).json({ 
        error: 'Error al calcular métricas',
        details: error.message 
      });
    }
  },

  // GET /api/historial/:tareaId
  async getHistorialTarea(req, res) {
    try {
      const { tareaId } = req.params;
      
      const historial = await db('historial_tareas as h')
        .leftJoin('desarrolladores as d', 'h.usuario_id', 'd.id')
        .select(
          'h.*',
          'd.nombre as usuario_nombre'
        )
        .where('h.tarea_id', tareaId)
        .orderBy('h.fecha_cambio', 'desc');

      res.json(historial);
    } catch (error) {
      res.status(500).json({ 
        error: 'Error al obtener historial',
        details: error.message 
      });
    }
  }
};

module.exports = metricasController;