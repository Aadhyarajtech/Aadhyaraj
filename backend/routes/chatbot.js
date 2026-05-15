const express = require('express');
const router = express.Router();
const { getChatbotResponse } = require('../controllers/chatbotController');

// @route POST /api/chatbot
// @desc Get chatbot response
// @access Public
router.post('/', getChatbotResponse);

module.exports = router;