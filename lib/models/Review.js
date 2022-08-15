const pool = require('../utils/pool');

module.exports = class Review {
  id;
  stars;
  description;
  userId;
  restaurantId;

  constructor(row) {
    this.id = row.id;
    this.stars = row.stars;
    this.description = row.description;
    this.userId = row.user_id;
    this.restaurantId = row.restaurant_id;
  }

  static async insert({ stars, description, user_id, restaurant_id }) {
    const { rows } = await pool.query(
      `INSERT INTO reviews (stars, description, user_id, restaurant_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [stars, description, user_id, restaurant_id]
    );
    return new Review(rows[0]);
  }
};
