const express = require('express');
const router = express.Router();
const {
    getProblems,
    getDueProblems,
    getProblem,
    addProblem,
    updateProblem,
    deleteProblem,
    reviseProblem,
    getDailyReminders,
    updateNotes,
    getCalendarSchedule,
} = require('../controllers/problemController');
const { protect } = require('../middleware/authMiddleware');

// All routes require auth
router.use(protect);

router.route('/').get(getProblems).post(addProblem);
router.get('/due', getDueProblems);
router.get('/calendar', getCalendarSchedule);
router.get('/reminders', getDailyReminders);
router.route('/:id').get(getProblem).put(updateProblem).delete(deleteProblem);
router.post('/:id/revise', reviseProblem);
router.post('/:id/notes', updateNotes);

module.exports = router;
