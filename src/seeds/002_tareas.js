exports.seed = async function(knex) {
  // Limpiar tablas relacionadas
  await knex('historial_tareas').del();
  await knex('tareas').del();
  
  const now = new Date();
  const hace3Dias = new Date(now - 3 * 24 * 60 * 60 * 1000);
  const hace1Dia = new Date(now - 1 * 24 * 60 * 60 * 1000);
  
  // Insertar tareas de ejemplo
  await knex('tareas').insert([
    {
      id: 1,
      codigo: 'APP-001',
      titulo: 'Módulo de Autenticación de Usuarios',
      descripcion: 'Implementar sistema de login/logout con JWT y validación de sesiones',
      desarrollador_id: 3,
      estado: 'codificando',
      prioridad: 'alta',
      fecha_creacion: hace3Dias,
      fecha_inicio_codificacion: hace3Dias
    },
    {
      id: 2,
      codigo: 'APP-002',
      titulo: 'Dashboard Principal con Métricas',
      descripcion: 'Crear dashboard con métricas en tiempo real usando teoría de colas',
      desarrollador_id: 4,
      estado: 'en_pruebas',
      prioridad: 'alta',
      fecha_creacion: hace3Dias,
      fecha_inicio_codificacion: hace3Dias,
      fecha_envio_pruebas: hace1Dia,
      checklist_completado: true,
      checklist_data: JSON.stringify([
        {"label": "Código documentado adecuadamente", "checked": true},
        {"label": "Pruebas unitarias ejecutadas", "checked": true},
        {"label": "Variables globales revisadas", "checked": true},
        {"label": "Integración con BD verificada", "checked": true},
        {"label": "Manejo de errores implementado", "checked": true}
      ])
    },
    {
      id: 3,
      codigo: 'APP-003',
      titulo: 'Integración API de Pagos',
      descripcion: 'Conectar con pasarela de pagos externa y manejar transacciones',
      desarrollador_id: 5,
      estado: 'pendiente',
      prioridad: 'media',
      fecha_creacion: now
    },
    {
      id: 4,
      codigo: 'APP-004',
      titulo: 'Sistema de Reportes',
      descripcion: 'Generar reportes PDF y Excel de métricas del sistema',
      desarrollador_id: 3,
      estado: 're_trabajo',
      prioridad: 'media',
      fecha_creacion: hace3Dias,
      fecha_inicio_codificacion: hace3Dias,
      fecha_envio_pruebas: hace1Dia,
      fecha_inicio_retrabajo: now,
      ciclos_retrabajo: 1
    },
    {
      id: 5,
      codigo: 'APP-005',
      titulo: 'Sistema de Notificaciones',
      descripcion: 'Implementar push notifications y emails automáticos',
      desarrollador_id: 4,
      estado: 'completada',
      prioridad: 'baja',
      fecha_creacion: hace3Dias,
      fecha_inicio_codificacion: hace3Dias,
      fecha_envio_pruebas: hace1Dia,
      fecha_completada: now,
      tiempo_total_dias: 3.0,
      checklist_completado: true,
      checklist_data: JSON.stringify([
        {"label": "Código documentado adecuadamente", "checked": true},
        {"label": "Pruebas unitarias ejecutadas", "checked": true},
        {"label": "Variables globales revisadas", "checked": true},
        {"label": "Integración con BD verificada", "checked": true},
        {"label": "Manejo de errores implementado", "checked": true}
      ])
    }
  ]);
};