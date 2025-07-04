// SEED PARA DESARROLLADORES (actualizado con el equipo real)
exports.seed = async function(knex) {
  // Limpiar tabla existente
  await knex('desarrolladores').del();
  
  // Insertar desarrolladores reales del proyecto Registradep
  await knex('desarrolladores').insert([
    {
      id: 1,
      nombre: 'Joseph Ortega',
      email: 'joseph.ortega@devdatep.com',
      es_lider: true,
      activo: true
    },
    {
      id: 2,
      nombre: 'Luis Murrugarra',
      email: 'luis.murrugarra@devdatep.com',
      es_lider: true, // Co-líder
      activo: true
    },
    {
      id: 3,
      nombre: 'Hugo Gallardo',
      email: 'hugo.gallardo3@unmsm.edu.pe',
      es_lider: false,
      activo: true
    },
    {
      id: 4,
      nombre: 'Diego de la Cruz',
      email: 'diego.delacruz@devdatep.com',
      es_lider: false,
      activo: true
    },
    {
      id: 5,
      nombre: 'Christopher Valdiviezo',
      email: 'christopher.valdiviezo@devdatep.com',
      es_lider: false,
      activo: true
    },
    {
      id: 6,
      nombre: 'Brelyn Jeri',
      email: 'brelyn.jeri@devdatep.com',
      es_lider: false,
      activo: true
    },
    {
      id: 7,
      nombre: 'Bruce Cardenas',
      email: 'bruce.cardenas@devdatep.com',
      es_lider: false,
      activo: true
    },
    {
      id: 8,
      nombre: 'Farith Tamayo',
      email: 'farith.tamayo@devdatep.com',
      es_lider: false,
      activo: true
    }
  ]);
};