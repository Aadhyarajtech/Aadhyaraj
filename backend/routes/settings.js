const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  getPublicSettings,
  resetSettings,
  updateMaintenance
} = require('../controllers/settingsController');
const { auth } = require('../middleware/auth');

// Public routes
router.get('/public', getPublicSettings);

// Admin routes
router.use(auth); // All routes below require authentication
router.get('/', getSettings);
router.put('/', updateSettings);
router.post('/reset', resetSettings);
router.put('/maintenance', updateMaintenance);

module.exports = router;