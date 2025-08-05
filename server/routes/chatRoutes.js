const express = require('express');
const ensureAuthenticated = require('../middleware/authMiddleware');
const router = express.Router();
const chatController = require('../api/chatController');

router.post('/ask', ensureAuthenticated, chatController.askAndSaveChat);

module.exports = router;
