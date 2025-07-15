const express = require('express');
const ensureAuthenticated = require('../middleware/authMiddleware');
const router = express.Router();
const homeController = require('../api/homeController');
const simpleAiController = require('../api/simpleAiController');

router.get('/',  ensureAuthenticated, homeController.Home);

router.post('/ask', ensureAuthenticated, async function(req, res){   
  const response = await simpleAiController.ask(req);
  res.json(response);
});

module.exports = router;