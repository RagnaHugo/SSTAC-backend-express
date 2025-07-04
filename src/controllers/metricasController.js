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

      // 2. Métricas de tareas completadas (MEJORADO - con fallback histórico)
      const hace30Dias = new Date();
      hace30Dias.setDate(hace30Dias.getDate() - 30);

      const tareasRecientes = await db('tareas')
        .where('fecha_completada', '>=', hace30Dias.toISOString())
        .where('estado', 'completada')
        .select('tiempo_total_dias', 'ciclos_retrabajo');

      // 🆕 TAMBIÉN obtener TODAS las tareas completadas (histórico)
      const todasTareasCompletadas = await db('tareas')
        .where('estado', 'completada')
        .whereNotNull('tiempo_total_dias')
        .select('tiempo_total_dias', 'ciclos_retrabajo');

      let tiempoPromedioTotal = 0;
      let tiempoPromedioHistorico = 0;
      let tasaRetrabajo = 0;
      let promedioRetrabajos = 0;
      let totalTareasCompletadas = tareasRecientes.length;

      // CALCULAR MÉTRICAS DE LOS ÚLTIMOS 30 DÍAS
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

      // 🔥 CALCULAR MÉTRICAS HISTÓRICAS (TODAS las tareas completadas)
      if (todasTareasCompletadas.length > 0) {
        tiempoPromedioHistorico = todasTareasCompletadas
          .reduce((sum, t) => sum + t.tiempo_total_dias, 0) / todasTareasCompletadas.length;
      }

      // 🎯 USAR HISTÓRICO SI NO HAY DATOS RECIENTES
      const tiempoPromedioFinal = tiempoPromedioTotal > 0 ? tiempoPromedioTotal : tiempoPromedioHistorico;

      // 3. CÁLCULO DINÁMICO DE LAMBDA Y MU BASADO EN DATOS REALES DEL PROYECTO ACTUAL
      
      // Obtener desarrolladores activos
      const desarrolladoresActivos = await db('desarrolladores')
        .where('activo', true)
        .count('* as count')
        .first();
      const servidoresActivos = desarrolladoresActivos.count;

      // 🆕 CALCULAR LAMBDA (tasa de llegada) dinámicamente
      const fechaPrimeraYUltimaTarea = await db('tareas')
        .select(
          db.raw('MIN(fecha_creacion) as primera_fecha'),
          db.raw('MAX(fecha_creacion) as ultima_fecha'),
          db.raw('COUNT(*) as total_tareas')
        )
        .first();

      let lambdaDinamica = 0;
      let periodoObservacion = 0;
      let comentarioLambda = "Sin datos suficientes";

      if (fechaPrimeraYUltimaTarea.primera_fecha && fechaPrimeraYUltimaTarea.ultima_fecha) {
        const fechaInicio = new Date(fechaPrimeraYUltimaTarea.primera_fecha);
        const fechaFin = new Date(fechaPrimeraYUltimaTarea.ultima_fecha);
        periodoObservacion = Math.max(1, (fechaFin - fechaInicio) / (1000 * 60 * 60 * 24)); // días
        
        lambdaDinamica = fechaPrimeraYUltimaTarea.total_tareas / periodoObservacion;
        comentarioLambda = `${fechaPrimeraYUltimaTarea.total_tareas} tareas en ${Math.round(periodoObservacion)} días`;
      }

      // 🆕 CALCULAR MU (tasa de servicio) dinámicamente
      const tareasCompletadasConTiempo = await db('tareas')
        .where('estado', 'completada')
        .whereNotNull('tiempo_total_dias')
        .select('tiempo_total_dias', 'desarrollador_id');

      let muDinamica = 0;
      let comentarioMu = "Sin datos de tareas completadas";

      if (tareasCompletadasConTiempo.length > 0 && servidoresActivos > 0) {
        // Tiempo promedio para completar una tarea
        const tiempoPromedioCompletacion = tareasCompletadasConTiempo
          .reduce((sum, t) => sum + t.tiempo_total_dias, 0) / tareasCompletadasConTiempo.length;
        
        // Mu = 1 / tiempo_promedio (tareas por día por desarrollador)
        muDinamica = 1 / tiempoPromedioCompletacion;
        comentarioMu = `1 tarea cada ${Math.round(tiempoPromedioCompletacion * 100) / 100} días por desarrollador`;
      }

      // 🆕 CALCULAR INTENSIDAD DEL SISTEMA (RHO) dinámicamente
      let utilizacionSistema = 0;
      let sistemaEstable = false;

      if (servidoresActivos > 0 && muDinamica > 0) {
        utilizacionSistema = lambdaDinamica / (servidoresActivos * muDinamica);
        sistemaEstable = utilizacionSistema < 1.0;
      }

      // 🆕 MÉTRICAS ADICIONALES DE RETRABAJO
      const totalTareasHistoricas = await db('tareas').count('* as count').first();
      const tareasConRetrabajoTotal = await db('tareas')
        .where('ciclos_retrabajo', '>', 0)
        .count('* as count')
        .first();
      
      const tasaRetrabajoHistorica = totalTareasHistoricas.count > 0 
        ? (tareasConRetrabajoTotal.count / totalTareasHistoricas.count) * 100 
        : 0;

      // 🆕 DETECTAR CONTEXTO DEL PROYECTO
      let contextoProyecto = "Proyecto en curso";
      if (periodoObservacion <= 7) {
        contextoProyecto = "Piloto/Sprint corto";
      } else if (periodoObservacion >= 60) {
        contextoProyecto = "Proyecto largo plazo";
      }

      const metricas = {
        // Métricas básicas
        tareas_por_estado: estadosCompletos,
        tiempo_ciclo_promedio: Math.round(tiempoPromedioFinal * 100) / 100,
        tiempo_ciclo_promedio_30_dias: Math.round(tiempoPromedioTotal * 100) / 100,
        tiempo_ciclo_promedio_historico: Math.round(tiempoPromedioHistorico * 100) / 100,
        tasa_retrabajo: Math.round(tasaRetrabajo * 10) / 10,
        tasa_retrabajo_historica: Math.round(tasaRetrabajoHistorica * 10) / 10,
        ciclos_retrabajo_promedio: Math.round(promedioRetrabajos * 100) / 100,
        
        // 🔥 MÉTRICAS DINÁMICAS DE TEORÍA DE COLAS
        utilizacion_sistema: Math.round(utilizacionSistema * 1000) / 1000,
        sistema_estable: sistemaEstable,
        periodo_observacion_dias: Math.round(periodoObservacion * 10) / 10,
        
        // Contadores
        total_tareas_completadas: totalTareasCompletadas,
        total_tareas_completadas_historicas: todasTareasCompletadas.length,
        total_tareas_sistema: totalTareasHistoricas.count,
        desarrolladores_activos: servidoresActivos,
        contexto_proyecto: contextoProyecto,
        
        // 🔥 INTERPRETACIÓN AUTOMÁTICA DEL ESTADO DEL SISTEMA
        interpretacion: {
          estado: utilizacionSistema >= 1.5 ? 'CRÍTICO' : 
                  utilizacionSistema >= 1.0 ? 'INESTABLE' : 
                  utilizacionSistema >= 0.8 ? 'SATURADO' : 'ESTABLE',
          mensaje: utilizacionSistema >= 1.5 ? 
            `Sistema críticamente sobrecargado (${Math.round(utilizacionSistema * 100)}%). Requiere intervención inmediata.` :
            utilizacionSistema >= 1.0 ? 
            `Sistema inestable (${Math.round(utilizacionSistema * 100)}%). La demanda supera la capacidad.` :
            utilizacionSistema >= 0.8 ? 
            `Sistema saturado (${Math.round(utilizacionSistema * 100)}%). Próximo a la inestabilidad.` :
            `Sistema estable (${Math.round(utilizacionSistema * 100)}%). Capacidad adecuada.`,
          color: utilizacionSistema >= 1.5 ? 'red' : 
                 utilizacionSistema >= 1.0 ? 'orange' : 
                 utilizacionSistema >= 0.8 ? 'yellow' : 'green',
          recomendacion: utilizacionSistema >= 1.0 ? 
            "Implementar mejoras de proceso para reducir retrabajo y aumentar eficiencia." :
            "Sistema funcionando dentro de parámetros normales."
        },
        
        // 🔥 PARÁMETROS DINÁMICOS DE TEORÍA DE COLAS
        parametros_colas: {
          lambda: Math.round(lambdaDinamica * 1000) / 1000,
          mu: Math.round(muDinamica * 1000) / 1000,
          servidores: servidoresActivos,
          explicacion_lambda: comentarioLambda,
          explicacion_mu: comentarioMu,
          capacidad_teorica: Math.round((servidoresActivos * muDinamica) * 1000) / 1000,
          deficit_capacidad: utilizacionSistema > 1 ? 
            Math.round((lambdaDinamica - (servidoresActivos * muDinamica)) * 1000) / 1000 : 0
        },

        // 🆕 VALORES DE REFERENCIA (del informe - solo para comparar)
        valores_referencia: {
          proyecto_scrum_ejemplo: {
            lambda: 1.246,
            mu: 0.307,
            rho: 1.51,
            descripcion: "Proyecto Scrum ejemplo del informe (98 días, 81 tareas)"
          },
          piloto_ejemplo: {
            lambda: 2.5,
            mu: 0.167,
            rho: 2.5,
            descripcion: "Piloto ejemplo del informe (4 días, 10 tareas)"
          },
          nota: "Estos son valores de referencia del informe. Los valores actuales se calculan dinámicamente."
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
  },

  // 🆕 GET /api/metricas/tendencias - Para análisis temporal
  async getTendencias(req, res) {
    try {
      const { dias = 30 } = req.query;
      
      // Análisis de tendencias por día
      const tendencias = await db('tareas')
        .select(
          db.raw('DATE(fecha_creacion) as fecha'),
          db.raw('COUNT(*) as tareas_creadas')
        )
        .where('fecha_creacion', '>=', db.raw(`datetime('now', '-${dias} days')`))
        .groupBy('fecha')
        .orderBy('fecha');

      const completadas = await db('tareas')
        .select(
          db.raw('DATE(fecha_completada) as fecha'),
          db.raw('COUNT(*) as tareas_completadas')
        )
        .where('fecha_completada', '>=', db.raw(`datetime('now', '-${dias} days')`))
        .whereNotNull('fecha_completada')
        .groupBy('fecha')
        .orderBy('fecha');

      res.json({
        tareas_creadas: tendencias,
        tareas_completadas: completadas,
        periodo_dias: dias
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Error al calcular tendencias',
        details: error.message 
      });
    }
  },

  // 🆕 GET /api/metricas/comparacion - Comparación con valores de referencia
  async getComparacionProyectos(req, res) {
    try {
      // Obtener métricas actuales
      const metricasActuales = await this.getMetricasInternas();
      
      const comparacion = {
        actual: {
          contexto: metricasActuales.contexto_proyecto,
          duracion_dias: metricasActuales.periodo_observacion_dias,
          tareas_totales: metricasActuales.total_tareas_sistema,
          tareas_completadas: metricasActuales.total_tareas_completadas_historicas,
          tasa_retrabajo: metricasActuales.tasa_retrabajo_historica,
          tiempo_promedio: metricasActuales.tiempo_ciclo_promedio,
          lambda: metricasActuales.parametros_colas.lambda,
          mu: metricasActuales.parametros_colas.mu,
          intensidad_rho: metricasActuales.utilizacion_sistema,
          estado: metricasActuales.interpretacion.estado
        },
        
        proyecto_scrum_referencia: {
          duracion_dias: 98,
          duracion_estimada: 65,
          desvio_porcentaje: 50.8,
          tareas_totales: 81,
          tareas_retrabajo: 32,
          tasa_retrabajo: 39.5,
          desarrolladores_promedio: 2.69,
          lambda: 1.246,
          mu: 0.307,
          intensidad_rho: 1.51,
          estado: "INESTABLE"
        },
        
        piloto_referencia: {
          duracion_dias: 4,
          tareas_monitoreadas: 10,
          tareas_completadas: 4,
          tareas_retrabajo: 2,
          tasa_retrabajo: 20.0,
          desarrolladores_activos: 6,
          lambda: 2.5,
          mu: 0.167,
          intensidad_rho: 2.5,
          estado: "CRÍTICO"
        },
        
        conclusion: {
          problema_confirmado: metricasActuales.utilizacion_sistema > 1.0,
          sistema_sobrecargado: metricasActuales.utilizacion_sistema >= 1.5,
          mejoras_necesarias: metricasActuales.utilizacion_sistema > 1.0 ? [
            "Implementar checklist de calidad previo",
            `Reducir probabilidad de retrabajo del ${metricasActuales.tasa_retrabajo_historica}% al 15%`,
            "Estandarizar documentación técnica",
            "Adoptar SSTAC como herramienta oficial"
          ] : [
            "Sistema funcionando correctamente",
            "Mantener monitoreo continuo"
          ]
        }
      };

      res.json(comparacion);
    } catch (error) {
      res.status(500).json({ 
        error: 'Error al generar comparación',
        details: error.message 
      });
    }
  },

  // 🔧 MÉTODO INTERNO para obtener métricas (reutilizable)
  async getMetricasInternas() {
    // Reutilizar la lógica del método getMetricas pero sin res.json
    // (Implementar si necesitas usar las métricas internamente)
    return {};
  }
};

module.exports = metricasController;