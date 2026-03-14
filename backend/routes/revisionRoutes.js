const express = require('express');
const router = express.Router();
const { getDebugSession, verifyFix } = require('../controllers/revisionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/debug/:id', getDebugSession);
router.post('/verify/:id', verifyFix);

module.exports = router;
