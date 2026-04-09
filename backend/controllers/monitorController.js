const { validationResult } = require('express-validator');
const Monitor = require('../models/Monitor');
const MonitorCheck = require('../models/MonitorCheck');

const createMonitor = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const { name, url, check_interval } = req.body;
    const checkInterval = Number.parseInt(check_interval, 10);
    if (!Number.isInteger(checkInterval) || checkInterval < 15) {
      return res.status(422).json({ success: false, message: 'check_interval must be an integer of at least 15 seconds' });
    }

    const monitor = await Monitor.create({
      userId: req.user.id,
      name,
      url,
      checkInterval
    });

    res.status(201).json({ success: true, monitor });
  } catch (error) {
    next(error);
  }
};

const listMonitors = async (req, res, next) => {
  try {
    const monitors = await Monitor.findAllByUser(req.user.id);
    res.json({ success: true, monitors });
  } catch (error) {
    next(error);
  }
};

const getMonitorStatus = async (req, res, next) => {
  try {
    const monitorId = Number.parseInt(req.params.id, 10);
    if (!Number.isInteger(monitorId) || monitorId <= 0) {
      return res.status(422).json({ success: false, message: 'Monitor ID must be a valid number' });
    }

    const monitor = await Monitor.findByIdAndUser(monitorId, req.user.id);
    if (!monitor) {
      return res.status(404).json({ success: false, message: 'Monitor not found' });
    }

    const stats = await MonitorCheck.getStats(monitorId);
    const checks = await MonitorCheck.findLatestByMonitor(monitorId, 10);

    res.json({
      success: true,
      monitor: {
        id: monitor.id,
        name: monitor.name,
        url: monitor.url,
        check_interval: monitor.check_interval,
        last_checked_at: monitor.last_checked_at
      },
      stats: {
        total_checks: Number(stats.total_checks || 0),
        success_count: Number(stats.success_count || 0),
        failure_count: Number(stats.total_checks || 0) - Number(stats.success_count || 0),
        average_response_time: stats.average_response_time != null ? Number(stats.average_response_time) : null,
        last_checked_at: stats.last_checked_at
      },
      recent_checks: checks
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createMonitor, listMonitors, getMonitorStatus };
