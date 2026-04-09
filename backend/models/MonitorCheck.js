const pool = require('../config/db');

class MonitorCheck {
  static async create({ monitorId, statusCode, responseTimeMs, success, errorMessage }) {
    const monitorIdNum = Number(monitorId);
    const statusCodeNum = Number(statusCode);
    const responseTimeNum = responseTimeMs != null ? Number(responseTimeMs) : null;
    const successFlag = success ? 1 : 0;

    const [result] = await pool.execute(
      'INSERT INTO monitor_checks (monitor_id, status_code, response_time_ms, success, error_message) VALUES (?, ?, ?, ?, ?)',
      [monitorIdNum, statusCodeNum, responseTimeNum, successFlag, errorMessage]
    );

    return {
      id: result.insertId,
      monitor_id: monitorIdNum,
      status_code: statusCodeNum,
      response_time_ms: responseTimeNum,
      success: Boolean(success),
      error_message: errorMessage
    };
  }

  static async findLatestByMonitor(monitorId, limit = 10) {
    const monitorIdNum = Number(monitorId);
    const safeLimit = Number.isInteger(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;
    const sql = `SELECT monitor_id, status_code, response_time_ms, success, checked_at, error_message FROM monitor_checks WHERE monitor_id = ? ORDER BY checked_at DESC LIMIT ${safeLimit}`;
    const [rows] = await pool.execute(sql, [monitorIdNum]);
    return rows;
  }

  static async getStats(monitorId) {
    const monitorIdNum = Number(monitorId);
    const [rows] = await pool.execute(
      `SELECT
        COUNT(*) AS total_checks,
        SUM(success) AS success_count,
        AVG(response_time_ms) AS average_response_time,
        MAX(checked_at) AS last_checked_at
      FROM monitor_checks
      WHERE monitor_id = ?`,
      [monitorIdNum]
    );

    return rows[0] || {
      total_checks: 0,
      success_count: 0,
      average_response_time: null,
      last_checked_at: null
    };
  }
}

module.exports = MonitorCheck;
