exports.up = function(knex) {
  return knex.schema.createTable('desarrolladores', table => {
    table.increments('id').primary();
    table.string('nombre', 100).notNullable();
    table.string('email', 100).unique().notNullable();
    table.boolean('es_lider').defaultTo(false);
    table.boolean('activo').defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('desarrolladores');
};