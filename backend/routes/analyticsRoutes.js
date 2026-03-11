const express = require('express');
const router = express.Router();
const { getWeeklyReport, getRecommendations } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

// All analytics routes require auth
router.use(protect);

router.get('/weekly', getWeeklyReport);
router.get('/recommendations', getRecommendations);

module.exports = router;
