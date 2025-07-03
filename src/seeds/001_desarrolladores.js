exports.seed = async function(knex) {
  // Limpiar tabla existente
  await knex('desarrolladores').del();
  
  // Insertar datos de ejemplo
  await knex('desarrolladores').insert([
    {
      id: 1,
      nombre: 'Hugo Miguel Gallardo',
      email: 'hugo.gallardo3@unmsm.edu.pe',
      es_lider: true,
      activo: true
    },
    {
      id: 2,
      nombre: 'Valeria Mauricio',
      email: 'valeria.mauricio@devdatep.com',
      es_lider: true,
      activo: true
    },
    {
      id: 3,
      nombre: 'Ana García López',
      email: 'ana.garcia@devdatep.com',
      es_lider: false,
      activo: true
    },
    {
      id: 4,
      nombre: 'Carlos Rodriguez',
      email: 'carlos.rodriguez@devdatep.com',
      es_lider: false,
      activo: true
    },
    {
      id: 5,
      nombre: 'María Fernández',
      email: 'maria.fernandez@devdatep.com',
      es_lider: false,
      activo: true
    }
  ]);
};