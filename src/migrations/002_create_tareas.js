exports.up = function(knex) {
  return knex.schema.createTable('tareas', table => {
    table.increments('id').primary();
    table.string('codigo', 20).unique().notNullable();
    table.string('titulo', 200).notNullable();
    table.text('descripcion');
    table.integer('desarrollador_id').unsigned().notNullable();
    table.enum('estado', ['pendiente', 'codificando', 'en_pruebas', 're_trabajo', 'completada'])
         .defaultTo('pendiente');
    table.enum('prioridad', ['alta', 'media', 'baja']).defaultTo('media');
    
    // Timestamps del ciclo de vida
    table.datetime('fecha_creacion').defaultTo(knex.fn.now());
    table.datetime('fecha_inicio_codificacion');
    table.datetime('fecha_envio_pruebas');
    table.datetime('fecha_inicio_retrabajo');
    table.datetime('fecha_completada');
    
    // Checklist y métricas
    table.boolean('checklist_completado').defaultTo(false);
    table.text('checklist_data'); // JSON
    table.integer('ciclos_retrabajo').defaultTo(0);
    table.decimal('tiempo_total_dias', 10, 2);
    
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('desarrollador_id').references('id').inTable('desarrolladores');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('tareas');
};