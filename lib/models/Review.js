const pool = require('../utils/pool');

module.exports = class Review {
  id;
  stars;
  detail;
  userId;
  restaurantId;

  constructor(row) {
    this.id = row.id;
    this.stars = row.stars;
    this.detail = row.detail;
    this.userId = row.user_id;
    this.restaurantId = row.restaurant_id;
  }

  static async insert({ stars, detail, user_id, restaurant_id }) {
    const { rows } = await pool.query(
      `INSERT INTO reviews (stars, detail, user_id, restaurant_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [stars, detail, user_id, restaurant_id]
    );
    return new Review(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      `DELETE FROM reviews WHERE id = $1
      RETURNING *`,
      [id]
    );
    return new Review(rows[0]);
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `SELECT * FROM reviews
      WHERE id = $1`,
      [id]
    );

    return new Review(rows[0]);
  }
};
