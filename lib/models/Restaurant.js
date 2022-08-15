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
    return rows.map((row) => new Restaurant(row));
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `SELECT * FROM restaurants
      WHERE id = $1`,
      [id]
    );

    return new Restaurant(rows[0]);
  }

  async getReviews() {
    const { rows } = await pool.query(
      `SELECT reviews.* FROM restaurants
      LEFT JOIN reviews ON reviews.restaurant_id = restaurants.id
      WHERE restaurants.id = $1`,
      [this.id]
    );
    return rows;
  }
};
