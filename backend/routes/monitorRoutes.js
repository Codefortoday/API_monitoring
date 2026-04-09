const express = require('express');
const { body, param } = require('express-validator');
const { authenticate } = require('../middleware/authMiddleware');
const { createMonitor, listMonitors, getMonitorStatus } = require('../controllers/monitorController');

const router = express.Router();

router.post(
  '/monitors',
  authenticate,
  [
    body('name').trim().notEmpty().withMessage('Monitor name is required'),
    body('url').trim().notEmpty().withMessage('URL is required').isURL({ require_protocol: true }).withMessage('Valid URL is required'),
    body('check_interval')
      .isInt({ min: 15 })
      .withMessage('check_interval must be an integer of at least 15 seconds')
  ],
  createMonitor
);

router.get('/monitors', authenticate, listMonitors);

router.get(
  '/monitors/:id/status',
  authenticate,
  [param('id').isInt().withMessage('Monitor ID must be a number')],
  getMonitorStatus
);

module.exports = router;
