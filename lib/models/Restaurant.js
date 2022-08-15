const pool = require('../utils/pool');

module.exports = class Restaurant {
  id;
  name;
  cuisine;
  city;

  constructor({ id, name, cuisine, city }) {
    this.id = id;
    this.name = name;
    this.cuisine = cuisine;
    this.city = city;
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM restaurants');
    console.log(rows);
    return rows.map((row) => new Restaurant(row));
  }
};
