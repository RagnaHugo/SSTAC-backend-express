const db = require('../config/database');

class Desarrollador {
  static async getAll() {
    return await db('desarrolladores')
      .where('activo', true)
      .select('*');
  }

  static async getById(id) {
    return await db('desarrolladores')
      .where('id', id)
      .first();
  }

  static async create(data) {
    const [id] = await db('desarrolladores').insert(data);
    return await this.getById(id);
  }

  static async update(id, data) {
    await db('desarrolladores')
      .where('id', id)
      .update(data);
    return await this.getById(id);
  }

  static async delete(id) {
    return await db('desarrolladores')
      .where('id', id)
      .update({ activo: false });
  }
}

module.exports = Desarrollador;