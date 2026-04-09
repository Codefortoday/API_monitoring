const fs = require('fs');
const path = require('path');

const errorLogPath = path.join(__dirname, '..', 'logs', 'error.log');

function logError(error) {
  const entry = `[${new Date().toISOString()}] ${error.message || 'Unknown error'}${error.stack ? '\n' + error.stack : ''}\n`;
  try {
    fs.appendFileSync(errorLogPath, entry);
  } catch (err) {
    console.error('Unable to write error log:', err);
  }
}

function errorHandler(err, req, res, next) {
  logError(err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error'
  });
}

module.exports = { errorHandler, logError };
