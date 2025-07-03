exports.up = function(knex) {
  return knex.schema.createTable('historial_tareas', table => {
    table.increments('id').primary();
    table.integer('tarea_id').unsigned().notNullable();
    table.string('estado_anterior', 50);
    table.string('estado_nuevo', 50).notNullable();
    table.datetime('fecha_cambio').defaultTo(knex.fn.now());
    table.text('comentarios');
    table.integer('usuario_id').unsigned();
    
    // Foreign keys
    table.foreign('tarea_id').references('id').inTable('tareas').onDelete('CASCADE');
    table.foreign('usuario_id').references('id').inTable('desarrolladores');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('historial_tareas');
};