const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  updateCareerPassword,
  getDashboard,
  checkAdminExists
} = require('../controllers/adminController');
const { auth, requireSuperAdmin } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/check', checkAdminExists);

// Protected routes
router.use(auth); // All routes below require authentication
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/career-password', requireSuperAdmin, updateCareerPassword);
router.get('/dashboard', getDashboard);

module.exports = router;