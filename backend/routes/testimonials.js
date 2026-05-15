const express = require('express');
const router = express.Router();
const {
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getAllTestimonials
} = require('../controllers/testimonialsController');
const { requireSuperAdmin } = require('../middleware/auth');
const { validateTestimonial } = require('../middleware/validation');

// Public routes
router.get('/', getTestimonials);
router.get('/:id', getTestimonial);

// Super admin only
router.get('/admin/all', requireSuperAdmin, getAllTestimonials);
router.post('/', requireSuperAdmin, validateTestimonial, createTestimonial);
router.put('/:id', requireSuperAdmin, validateTestimonial, updateTestimonial);
router.delete('/:id', requireSuperAdmin, deleteTestimonial);

module.exports = router;
