const express = require('express');
const router = express.Router();
const { getAlgorithms, getAlgorithmByName } = require('../controllers/algorithmController');
const { protect } = require('../middleware/authMiddleware');

// Public route for now, or protect if needed
// router.use(protect); 

router.get('/', getAlgorithms);
router.get('/:name', getAlgorithmByName);

module.exports = router;
