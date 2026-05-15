const validator = require('validator');

const validateContact = (req, res, next) => {
  const { name, email, subject, message } = req.body;
  const errors = [];

  if (!name || !validator.isLength(name, { min: 2, max: 100 })) {
    errors.push('Name is required and must be 2-100 characters');
  }

  if (!email || !validator.isEmail(email)) {
    errors.push('Valid email is required');
  }

  if (!subject || !validator.isLength(subject, { min: 5, max: 200 })) {
    errors.push('Subject is required and must be 5-200 characters');
  }

  if (!message || !validator.isLength(message, { min: 10, max: 2000 })) {
    errors.push('Message is required and must be 10-2000 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

const validateJobApplication = (req, res, next) => {
  const { applicantName, email, experience } = req.body;
  const errors = [];

  if (!applicantName || !validator.isLength(applicantName, { min: 2, max: 100 })) {
    errors.push('Applicant name is required and must be 2-100 characters');
  }

  if (!email || !validator.isEmail(email)) {
    errors.push('Valid email is required');
  }

  if (!experience || !['0-1 years', '1-3 years', '3-5 years', '5-8 years', '8+ years'].includes(experience)) {
    errors.push('Valid experience level is required');
  }

  if (!req.file && !req.body.resume) {
    errors.push('Resume file is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

const validateService = (req, res, next) => {
  const { title, description, icon } = req.body;
  const errors = [];

  if (!title || !validator.isLength(title, { min: 3, max: 100 })) {
    errors.push('Title is required and must be 3-100 characters');
  }

  if (!description || !validator.isLength(description, { min: 10, max: 500 })) {
    errors.push('Description is required and must be 10-500 characters');
  }

  if (!icon) {
    errors.push('Icon is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

const validateTestimonial = (req, res, next) => {
  const { name, position, company, country, message, rating } = req.body;
  const errors = [];

  if (!name || !validator.isLength(name, { min: 2, max: 100 })) {
    errors.push('Name is required and must be 2-100 characters');
  }

  if (!position || !validator.isLength(position, { min: 2, max: 100 })) {
    errors.push('Position is required and must be 2-100 characters');
  }

  if (!company || !validator.isLength(company, { min: 2, max: 100 })) {
    errors.push('Company is required and must be 2-100 characters');
  }

  if (!country || !validator.isLength(country, { min: 2, max: 50 })) {
    errors.push('Country is required and must be 2-50 characters');
  }

  if (!message || !validator.isLength(message, { min: 10, max: 1000 })) {
    errors.push('Message is required and must be 10-1000 characters');
  }

  if (!rating || rating < 1 || rating > 5) {
    errors.push('Rating is required and must be between 1 and 5');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

const validateCareer = (req, res, next) => {
  const { title, department, location, type, experience, description } = req.body;
  const errors = [];

  if (!title || !validator.isLength(title, { min: 3, max: 200 })) {
    errors.push('Title is required and must be 3-200 characters');
  }

  if (!department || !validator.isLength(department, { min: 2, max: 100 })) {
    errors.push('Department is required and must be 2-100 characters');
  }

  if (!location || !validator.isLength(location, { min: 2, max: 100 })) {
    errors.push('Location is required and must be 2-100 characters');
  }

  if (!type || !['Full-time', 'Part-time', 'Contract', 'Remote', 'Hybrid'].includes(type)) {
    errors.push('Valid job type is required');
  }

  if (!experience || !validator.isLength(experience, { min: 2, max: 100 })) {
    errors.push('Valid experience level is required');
  }

  if (!description || !validator.isLength(description, { min: 10, max: 5000 })) {
    errors.push('Description is required and must be 10-5000 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

module.exports = {
  validateContact,
  validateJobApplication,
  validateService,
  validateTestimonial,
  validateCareer
};