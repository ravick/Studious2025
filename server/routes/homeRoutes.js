const express = require('express');
const ensureAuthenticated = require('../middleware/authMiddleware');
const router = express.Router();
const homeController = require('../api/homeController');

router.get('/', ensureAuthenticated, homeController.Home);

module.exports = router;