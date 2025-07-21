const express = require('express');
const ensureAuthenticated = require('../middleware/authMiddleware');
const router = express.Router();
const topicsController = require('../api/topicsController');

router.get('/',  ensureAuthenticated, topicsController.getTopics);

module.exports = router;
