const express = require('express');
const ensureAuthenticated = require('../middleware/authMiddleware');
const router = express.Router();
const chatController = require('../api/chatController');


// Save a question/answer pair (optional - if not already handled elsewhere)

router.post('/ask', ensureAuthenticated, chatController.askAndSaveChat);
router.get('/history', ensureAuthenticated, chatController.getChatHistory);
module.exports = router;
