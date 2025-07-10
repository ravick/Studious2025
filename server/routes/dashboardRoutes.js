const express = require('express');
const ensureAuthenticated = require('../middleware/authMiddleware');
const router = express.Router();
const dashboardController = require('../api/dashboardController');

router.get('/home', ensureAuthenticated, dashboardController.DashboardHome);

module.exports = router;