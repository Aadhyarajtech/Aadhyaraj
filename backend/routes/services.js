const express = require('express');
const router = express.Router();
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getAllServices
} = require('../controllers/servicesController');
const { requireSuperAdmin } = require('../middleware/auth');
const { validateService } = require('../middleware/validation');

// Public routes
router.get('/', getServices);
router.get('/:id', getService);

// Super admin only
router.get('/admin/all', requireSuperAdmin, getAllServices);
router.post('/', requireSuperAdmin, validateService, createService);
router.put('/:id', requireSuperAdmin, validateService, updateService);
router.delete('/:id', requireSuperAdmin, deleteService);

module.exports = router;
