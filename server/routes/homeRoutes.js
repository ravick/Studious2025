const express = require('express');
const ensureAuthenticated = require('../middleware/authMiddleware');
const router = express.Router();
const homeController = require('../api/homeController');
const simpleAiController = require('../api/simpleAiController');
const db = require('../config/db'); // Make sure this path is correct for your db instance

router.get('/', ensureAuthenticated, homeController.Home);

module.exports = router;
