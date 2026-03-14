const express = require('express');
const router = express.Router();
const { getDebugSession, verifyFix, fetchSolution } = require('../controllers/revisionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/debug/:id', getDebugSession);
router.post('/verify/:id', verifyFix);
router.post('/fetch-solution/:id', fetchSolution);

module.exports = router;
