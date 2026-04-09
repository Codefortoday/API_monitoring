const axios = require('axios');
const Monitor = require('../models/Monitor');
const MonitorCheck = require('../models/MonitorCheck');

const checkMonitor = async (monitor) => {
  const start = Date.now();
  let statusCode = 0;
  let success = false;
  let responseTimeMs = null;
  let errorMessage = null;

  try {
    const response = await axios.get(monitor.url, {
      timeout: 15000,
      validateStatus: () => true
    });

    responseTimeMs = Date.now() - start;
    statusCode = response.status;
    success = response.status >= 200 && response.status < 400;
  } catch (err) {
    responseTimeMs = Date.now() - start;
    errorMessage = err.message;
    if (err.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out';
    }
    if (err.response) {
      statusCode = err.response.status;
    }
  }

  await MonitorCheck.create({
    monitorId: monitor.id,
    statusCode,
    responseTimeMs,
    success,
    errorMessage
  });

  await Monitor.updateLastChecked(monitor.id);
};

const startMonitorChecker = () => {
  setInterval(async () => {
    try {
      const monitors = await Monitor.findDueMonitors();
      const now = Date.now();

      await Promise.all(
        monitors.map(async (monitor) => {
          const lastChecked = monitor.last_checked_at ? new Date(monitor.last_checked_at).getTime() : 0;
          const intervalMs = Number(monitor.check_interval) * 1000;
          if (isNaN(intervalMs) || intervalMs <= 0) {
            return;
          }
          if (now - lastChecked >= intervalMs) {
            await checkMonitor(monitor);
          }
        })
      );
    } catch (err) {
      console.error('Monitor checker failed:', err.message);
    }
  }, 15000);
};

module.exports = { startMonitorChecker };
