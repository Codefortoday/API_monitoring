const pool = require('../config/db');

class Monitor {
  static async create({ userId, name, url, checkInterval }) {
    const [result] = await pool.execute(
      'INSERT INTO monitors (user_id, name, url, check_interval) VALUES (?, ?, ?, ?)',
      [Number(userId), name, url, Number(checkInterval)]
    );
    return {
      id: result.insertId,
      user_id: Number(userId),
      name,
      url,
      check_interval: Number(checkInterval)
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM monitors WHERE id = ?', [Number(id)]);
    return rows[0];
  }

  static async findByIdAndUser(id, userId) {
    const [rows] = await pool.execute('SELECT * FROM monitors WHERE id = ? AND user_id = ?', [Number(id), Number(userId)]);
    return rows[0];
  }

  static async findAllByUser(userId) {
    const [rows] = await pool.execute('SELECT * FROM monitors WHERE user_id = ? ORDER BY created_at DESC', [Number(userId)]);
    return rows;
  }

  static async findDueMonitors() {
    const [rows] = await pool.execute('SELECT * FROM monitors');
    return rows;
  }

  static async updateLastChecked(id) {
    await pool.execute('UPDATE monitors SET last_checked_at = NOW() WHERE id = ?', [Number(id)]);
  }
}

module.exports = Monitor;
