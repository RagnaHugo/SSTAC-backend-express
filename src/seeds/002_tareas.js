exports.seed = async function(knex) {
  // Limpiar tablas relacionadas
  await knex('historial_tareas').del();
  await knex('tareas').del();
  
  // Definir fechas del piloto
  const lunes30 = new Date('2025-06-30T08:00:00');
  const martes01 = new Date('2025-07-01T08:00:00');
  const miercoles02 = new Date('2025-07-02T08:00:00');
  const jueves03 = new Date('2025-07-03T08:00:00');
  
  // Insertar tareas del piloto
  await knex('tareas').insert([
    // LUNES 30/06 - Tareas que empezaron el lunes
    {
      id: 1,
      codigo: 'REG-001',
      titulo: 'Grid de Consulta de Registros Principales',
      descripcion: 'Crear grid ScriptCase para mostrar registros principales con filtros dinámicos',
      desarrollador_id: 3, // Hugo Gallardo
      estado: 'completada',
      prioridad: 'alta',
      fecha_creacion: lunes30,
      fecha_inicio_codificacion: new Date('2025-06-30T08:30:00'),
      fecha_envio_pruebas: new Date('2025-06-30T15:00:00'),
      fecha_completada: new Date('2025-06-30T17:30:00'),
      tiempo_total_dias: 1.0,
      checklist_completado: true,
      checklist_data: JSON.stringify([
        {"label": "Grid ScriptCase configurado correctamente", "checked": true},
        {"label": "Filtros funcionando", "checked": true},
        {"label": "Responsive design aplicado", "checked": true},
        {"label": "Consulta SQL optimizada", "checked": true},
        {"label": "Validación de datos implementada", "checked": true}
      ])
    },
    
    {
      id: 2,
      codigo: 'REG-002',
      titulo: 'Corrección Error Validación de Formularios',
      descripcion: 'Resolver bug en validación de campos obligatorios que permite envío vacío',
      desarrollador_id: 4, // Diego de la Cruz
      estado: 're_trabajo',
      prioridad: 'alta',
      fecha_creacion: lunes30,
      fecha_inicio_codificacion: new Date('2025-06-30T09:00:00'),
      fecha_envio_pruebas: new Date('2025-06-30T16:00:00'),
      fecha_inicio_retrabajo: new Date('2025-07-01T10:00:00'),
      ciclos_retrabajo: 1
    },
    
    {
      id: 3,
      codigo: 'REG-003',
      titulo: 'Grid de Reportes con Exportación',
      descripcion: 'Implementar grid para reportes con opción de exportar a PDF y Excel',
      desarrollador_id: 5, // Christopher Valdiviezo
      estado: 'codificando',
      prioridad: 'media',
      fecha_creacion: lunes30,
      fecha_inicio_codificacion: new Date('2025-06-30T10:00:00')
    },
    
    // MARTES 01/07 - Nuevas tareas y evolución
    {
      id: 4,
      codigo: 'REG-004',
      titulo: 'Búsqueda y Solución Error Base de Datos',
      descripcion: 'Investigar y corregir error de conexión a BD que causa timeouts',
      desarrollador_id: 6, // Brelyn Jeri
      estado: 'en_pruebas',
      prioridad: 'alta',
      fecha_creacion: martes01,
      fecha_inicio_codificacion: new Date('2025-07-01T08:30:00'),
      fecha_envio_pruebas: new Date('2025-07-01T14:00:00'),
      checklist_completado: true,
      checklist_data: JSON.stringify([
        {"label": "Conexión BD optimizada", "checked": true},
        {"label": "Pool de conexiones configurado", "checked": true},
        {"label": "Timeouts ajustados", "checked": true},
        {"label": "Logs de error implementados", "checked": false},
        {"label": "Pruebas de carga realizadas", "checked": true}
      ])
    },
    
    {
      id: 5,
      codigo: 'REG-005',
      titulo: 'Formulario de Registro de Usuarios',
      descripcion: 'Crear formulario ScriptCase para registro de nuevos usuarios del sistema',
      desarrollador_id: 7, // Bruce Cardenas
      estado: 'pendiente',
      prioridad: 'media',
      fecha_creacion: martes01
    },
    
    {
      id: 6,
      codigo: 'REG-006',
      titulo: 'Solución Error Carga de Imágenes',
      descripcion: 'Corregir problema en carga de archivos que falla con imágenes >2MB',
      desarrollador_id: 8, // Farith Tamayo
      estado: 'completada',
      prioridad: 'alta',
      fecha_creacion: martes01,
      fecha_inicio_codificacion: new Date('2025-07-01T09:00:00'),
      fecha_envio_pruebas: new Date('2025-07-01T16:30:00'),
      fecha_completada: new Date('2025-07-02T11:00:00'),
      tiempo_total_dias: 1.5,
      checklist_completado: true,
      checklist_data: JSON.stringify([
        {"label": "Validación de tamaño implementada", "checked": true},
        {"label": "Compresión automática activada", "checked": true},
        {"label": "Formatos permitidos verificados", "checked": true},
        {"label": "Mensajes de error personalizados", "checked": true},
        {"label": "Pruebas con diferentes tamaños", "checked": true}
      ])
    },
    
    // MIÉRCOLES 02/07 - Continuación y nuevas tareas
    {
      id: 7,
      codigo: 'REG-007',
      titulo: 'Grid de Historial de Actividades',
      descripcion: 'Desarrollar grid para mostrar historial completo de actividades del usuario',
      desarrollador_id: 4, // Diego de la Cruz (después del retrabajo)
      estado: 'codificando',
      prioridad: 'baja',
      fecha_creacion: miercoles02,
      fecha_inicio_codificacion: new Date('2025-07-02T13:00:00')
    },
    
    {
      id: 8,
      codigo: 'REG-008',
      titulo: 'Corrección Error Autenticación',
      descripcion: 'Resolver fallo en sistema de login que no valida sesiones expiradas',
      desarrollador_id: 3, // Hugo Gallardo
      estado: 're_trabajo',
      prioridad: 'alta',
      fecha_creacion: miercoles02,
      fecha_inicio_codificacion: new Date('2025-07-02T08:30:00'),
      fecha_envio_pruebas: new Date('2025-07-02T15:00:00'),
      fecha_inicio_retrabajo: new Date('2025-07-03T09:00:00'),
      ciclos_retrabajo: 1
    },
    
    // JUEVES 03/07 - Cierre del piloto
    {
      id: 9,
      codigo: 'REG-009',
      titulo: 'Dashboard de Métricas en Tiempo Real',
      descripcion: 'Implementar dashboard con métricas del sistema usando widgets ScriptCase',
      desarrollador_id: 5, // Christopher Valdiviezo
      estado: 'en_pruebas',
      prioridad: 'media',
      fecha_creacion: jueves03,
      fecha_inicio_codificacion: new Date('2025-07-03T08:00:00'),
      fecha_envio_pruebas: new Date('2025-07-03T16:00:00'),
      checklist_completado: false
    },
    
    {
      id: 10,
      codigo: 'REG-010',
      titulo: 'Optimización Consultas SQL Lentas',
      descripcion: 'Identificar y optimizar consultas que tardan más de 3 segundos',
      desarrollador_id: 6, // Brelyn Jeri
      estado: 'completada',
      prioridad: 'alta',
      fecha_creacion: jueves03,
      fecha_inicio_codificacion: new Date('2025-07-03T08:30:00'),
      fecha_envio_pruebas: new Date('2025-07-03T14:00:00'),
      fecha_completada: new Date('2025-07-03T17:00:00'),
      tiempo_total_dias: 1.0,
      checklist_completado: true,
      checklist_data: JSON.stringify([
        {"label": "Consultas identificadas y documentadas", "checked": true},
        {"label": "Índices optimizados", "checked": true},
        {"label": "Queries reescritas", "checked": true},
        {"label": "Pruebas de rendimiento realizadas", "checked": true},
        {"label": "Documentación actualizada", "checked": true}
      ])
    }
  ]);
  
  // Insertar historial de cambios de estado
  await knex('historial_tareas').insert([
    // REG-001 (Hugo) - Completada exitosamente
    { tarea_id: 1, estado_anterior: null, estado_nuevo: 'pendiente', fecha_cambio: lunes30, usuario_id: 3 },
    { tarea_id: 1, estado_anterior: 'pendiente', estado_nuevo: 'codificando', fecha_cambio: new Date('2025-06-30T08:30:00'), usuario_id: 3 },
    { tarea_id: 1, estado_anterior: 'codificando', estado_nuevo: 'en_pruebas', fecha_cambio: new Date('2025-06-30T15:00:00'), usuario_id: 3 },
    { tarea_id: 1, estado_anterior: 'en_pruebas', estado_nuevo: 'completada', fecha_cambio: new Date('2025-06-30T17:30:00'), usuario_id: 1 },
    
    // REG-002 (Diego) - Con retrabajo
    { tarea_id: 2, estado_anterior: null, estado_nuevo: 'pendiente', fecha_cambio: lunes30, usuario_id: 4 },
    { tarea_id: 2, estado_anterior: 'pendiente', estado_nuevo: 'codificando', fecha_cambio: new Date('2025-06-30T09:00:00'), usuario_id: 4 },
    { tarea_id: 2, estado_anterior: 'codificando', estado_nuevo: 'en_pruebas', fecha_cambio: new Date('2025-06-30T16:00:00'), usuario_id: 4 },
    { tarea_id: 2, estado_anterior: 'en_pruebas', estado_nuevo: 're_trabajo', fecha_cambio: new Date('2025-07-01T10:00:00'), usuario_id: 1, comentarios: 'Validación no funciona correctamente en formularios anidados' },
    
    // REG-003 (Christopher) - En desarrollo
    { tarea_id: 3, estado_anterior: null, estado_nuevo: 'pendiente', fecha_cambio: lunes30, usuario_id: 5 },
    { tarea_id: 3, estado_anterior: 'pendiente', estado_nuevo: 'codificando', fecha_cambio: new Date('2025-06-30T10:00:00'), usuario_id: 5 },
    
    // REG-004 (Brelyn) - En pruebas
    { tarea_id: 4, estado_anterior: null, estado_nuevo: 'pendiente', fecha_cambio: martes01, usuario_id: 6 },
    { tarea_id: 4, estado_anterior: 'pendiente', estado_nuevo: 'codificando', fecha_cambio: new Date('2025-07-01T08:30:00'), usuario_id: 6 },
    { tarea_id: 4, estado_anterior: 'codificando', estado_nuevo: 'en_pruebas', fecha_cambio: new Date('2025-07-01T14:00:00'), usuario_id: 6 },
    
    // REG-005 (Bruce) - Pendiente
    { tarea_id: 5, estado_anterior: null, estado_nuevo: 'pendiente', fecha_cambio: martes01, usuario_id: 7 },
    
    // REG-006 (Farith) - Completada
    { tarea_id: 6, estado_anterior: null, estado_nuevo: 'pendiente', fecha_cambio: martes01, usuario_id: 8 },
    { tarea_id: 6, estado_anterior: 'pendiente', estado_nuevo: 'codificando', fecha_cambio: new Date('2025-07-01T09:00:00'), usuario_id: 8 },
    { tarea_id: 6, estado_anterior: 'codificando', estado_nuevo: 'en_pruebas', fecha_cambio: new Date('2025-07-01T16:30:00'), usuario_id: 8 },
    { tarea_id: 6, estado_anterior: 'en_pruebas', estado_nuevo: 'completada', fecha_cambio: new Date('2025-07-02T11:00:00'), usuario_id: 2 },
    
    // REG-007 (Diego) - En desarrollo
    { tarea_id: 7, estado_anterior: null, estado_nuevo: 'pendiente', fecha_cambio: miercoles02, usuario_id: 4 },
    { tarea_id: 7, estado_anterior: 'pendiente', estado_nuevo: 'codificando', fecha_cambio: new Date('2025-07-02T13:00:00'), usuario_id: 4 },
    
    // REG-008 (Hugo) - Con retrabajo
    { tarea_id: 8, estado_anterior: null, estado_nuevo: 'pendiente', fecha_cambio: miercoles02, usuario_id: 3 },
    { tarea_id: 8, estado_anterior: 'pendiente', estado_nuevo: 'codificando', fecha_cambio: new Date('2025-07-02T08:30:00'), usuario_id: 3 },
    { tarea_id: 8, estado_anterior: 'codificando', estado_nuevo: 'en_pruebas', fecha_cambio: new Date('2025-07-02T15:00:00'), usuario_id: 3 },
    { tarea_id: 8, estado_anterior: 'en_pruebas', estado_nuevo: 're_trabajo', fecha_cambio: new Date('2025-07-03T09:00:00'), usuario_id: 2, comentarios: 'Validación de sesión no detecta tokens expirados' },
    
    // REG-009 (Christopher) - En pruebas
    { tarea_id: 9, estado_anterior: null, estado_nuevo: 'pendiente', fecha_cambio: jueves03, usuario_id: 5 },
    { tarea_id: 9, estado_anterior: 'pendiente', estado_nuevo: 'codificando', fecha_cambio: new Date('2025-07-03T08:00:00'), usuario_id: 5 },
    { tarea_id: 9, estado_anterior: 'codificando', estado_nuevo: 'en_pruebas', fecha_cambio: new Date('2025-07-03T16:00:00'), usuario_id: 5 },
    
    // REG-010 (Brelyn) - Completada
    { tarea_id: 10, estado_anterior: null, estado_nuevo: 'pendiente', fecha_cambio: jueves03, usuario_id: 6 },
    { tarea_id: 10, estado_anterior: 'pendiente', estado_nuevo: 'codificando', fecha_cambio: new Date('2025-07-03T08:30:00'), usuario_id: 6 },
    { tarea_id: 10, estado_anterior: 'codificando', estado_nuevo: 'en_pruebas', fecha_cambio: new Date('2025-07-03T14:00:00'), usuario_id: 6 },
    { tarea_id: 10, estado_anterior: 'en_pruebas', estado_nuevo: 'completada', fecha_cambio: new Date('2025-07-03T17:00:00'), usuario_id: 1 }
  ]);
};