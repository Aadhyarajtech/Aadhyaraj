const express = require('express');
const router = express.Router();
const {
  submitContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
  getContactStats
} = require('../controllers/contactController');
const { requireSuperAdmin } = require('../middleware/auth');
const { validateContact } = require('../middleware/validation');

// Public routes
router.post('/', validateContact, submitContact);

// Super admin only routes
router.use(requireSuperAdmin);
router.get('/', getContacts);
router.get('/stats', getContactStats);
router.get('/:id', getContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

module.exports = router;
