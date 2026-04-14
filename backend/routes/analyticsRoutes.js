const express = require('express');
const router = express.Router();
const { getWeeklyReport, getRecommendations, trackInteraction } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

// All analytics routes require auth
router.use(protect);

router.get('/weekly', getWeeklyReport);
router.get('/recommendations', getRecommendations);
router.post('/track-interaction', trackInteraction);

module.exports = router;
