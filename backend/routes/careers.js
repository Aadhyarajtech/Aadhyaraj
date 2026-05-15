const express = require('express');
const router = express.Router();
const {
  getCareers,
  getCareer,
  createCareer,
  updateCareer,
  deleteCareer,
  getAllCareers,
  submitApplication,
  getCareerApplications,
  getAllApplications,
  updateApplication,
  deleteApplication
} = require('../controllers/careersController');
const { requireCareerAdmin } = require('../middleware/auth');
const { validateCareer, validateJobApplication } = require('../middleware/validation');
const { uploadSingle } = require('../middleware/upload');

// Public routes
router.get('/', getCareers);

// Career admin or super admin routes
router.get('/admin/all', requireCareerAdmin, getAllCareers);
router.get('/applications/all', requireCareerAdmin, getAllApplications);
router.put('/applications/:id', requireCareerAdmin, updateApplication);
router.delete('/applications/:id', requireCareerAdmin, deleteApplication);

// Admin CRUD
router.post('/', requireCareerAdmin, validateCareer, createCareer);
router.put('/:id', requireCareerAdmin, validateCareer, updateCareer);
router.delete('/:id', requireCareerAdmin, deleteCareer);

// Public single + apply
router.get('/:id', getCareer);
router.post('/:id/apply', uploadSingle('resume'), validateJobApplication, submitApplication);

// Career admin - applications for specific career
router.get('/:id/applications', requireCareerAdmin, getCareerApplications);

module.exports = router;
