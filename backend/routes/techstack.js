const express = require('express');
const router = express.Router();
const {
  getTechStack,
  getAllTechStack,
  getTechItem,
  createTechItem,
  updateTechItem,
  deleteTechItem
} = require('../controllers/techStackController');
const { requireSuperAdmin } = require('../middleware/auth');

// Public routes
router.get('/', getTechStack);
router.get('/:id', getTechItem);

// Super admin only
router.get('/admin/all', requireSuperAdmin, getAllTechStack);
router.post('/', requireSuperAdmin, createTechItem);
router.put('/:id', requireSuperAdmin, updateTechItem);
router.delete('/:id', requireSuperAdmin, deleteTechItem);

module.exports = router;
