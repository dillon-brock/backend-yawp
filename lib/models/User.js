const pool = require('../utils/pool');

module.exports = class User {
  id;
  firstName;
  lastName;
  email;
  #passwordHash;

  constructor({ id, first_name, last_name, email, password_hash }) {
    this.id = id;
    this.firstName = first_name;
    this.lastName = last_name;
    this.email = email;
    this.#passwordHash = password_hash;
  }

  static async insert({ firstName, lastName, email, passwordHash }) {
    const { rows } = await pool.query(
      `INSERT INTO yawp_users (first_name, last_name, email, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [firstName, lastName, email, passwordHash]
    );

    return new User(rows[0]);
  }

  static async insertGoogleProfile({ firstName, lastName, email }) {
    const { rows } = await pool.query(
      `INSERT INTO yawp_users (first_name, last_name, email)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [firstName, lastName, email]
    );

    return new User(rows[0]);
  }

  static async getByEmail(email) {
    const { rows } = await pool.query(
      `SELECT * FROM yawp_users
      WHERE email = $1`,
      [email]
    );
    if (!rows[0]) return null;
    return new User(rows[0]);
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `SELECT * FROM yawp_users
      WHERE id = $1`,
      [id]
    );
    if (!rows[0]) return null;
    return new User(rows[0]);
  }

  async getReviews() {
    const { rows } = await pool.query(
      `SELECT * FROM reviews
      WHERE user_id = $1`,
      [this.id]
    );
    if (!rows[0]) return null;
    return rows;
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM yawp_users');
    return rows.map((row) => new User(row));
  }

  get passwordHash() {
    return this.#passwordHash;
  }

  toJSON() {
    return { ...this };
  }
};
