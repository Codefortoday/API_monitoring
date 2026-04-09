const pool = require('../config/db');

class User {
  static async create({ name, email, passwordHash }) {
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, passwordHash]
    );
    return { id: result.insertId, name, email };
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT id, name, email FROM users WHERE id = ?', [Number(id)]);
    return rows[0] || null;
  }
}

module.exports = User;
