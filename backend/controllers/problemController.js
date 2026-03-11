const Problem = require('../models/Problem');
const { calculateNextRevision, getInitialRevisionDate } = require('../utils/spacedRepetition');

// @desc  Get all problems for user
// @route GET /api/problems
const getProblems = async (req, res) => {
    try {
        const { topic, difficulty, search } = req.query;
        let filter = { user: req.user._id };

        if (topic) filter.topics = { $in: [topic] };
        if (difficulty) filter.difficulty = difficulty;
        if (search) filter.title = { $regex: search, $options: 'i' };

        const problems = await Problem.find(filter).sort({ createdAt: -1 });
        res.json(problems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc  Get problems due for revision today
// @route GET /api/problems/due
const getDueProblems = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        const problems = await Problem.find({
            user: req.user._id,
            nextRevisionDate: { $lte: today },
        }).sort({ nextRevisionDate: 1 });

        res.json(problems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc  Get a single problem
// @route GET /api/problems/:id
const getProblem = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);

        if (!problem) return res.status(404).json({ message: 'Problem not found' });

        if (problem.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(problem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc  Add a new problem
// @route POST /api/problems
const addProblem = async (req, res) => {
    const { title, leetcodeUrl, difficulty, topics, notes, solvedDate } = req.body;

    if (!title || !difficulty) {
        return res.status(400).json({ message: 'Title and difficulty are required' });
    }

    try {
        // Auto-schedule first revision for 1 day from now
        const nextRevisionDate = getInitialRevisionDate();

        const problem = await Problem.create({
            user: req.user._id,
            title,
            leetcodeUrl,
            difficulty,
            topics: topics || [],
            notes,
            solvedDate: solvedDate || new Date(),
            nextRevisionDate,
            revisionCount: 0,
        });

        res.status(201).json(problem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc  Update a problem
// @route PUT /api/problems/:id
const updateProblem = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);

        if (!problem) return res.status(404).json({ message: 'Problem not found' });

        if (problem.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { title, leetcodeUrl, difficulty, topics, notes } = req.body;
        problem.title = title || problem.title;
        problem.leetcodeUrl = leetcodeUrl ?? problem.leetcodeUrl;
        problem.difficulty = difficulty || problem.difficulty;
        problem.topics = topics || problem.topics;
        problem.notes = notes ?? problem.notes;

        const updated = await problem.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc  Delete a problem
// @route DELETE /api/problems/:id
const deleteProblem = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);

        if (!problem) return res.status(404).json({ message: 'Problem not found' });

        if (problem.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await problem.deleteOne();
        res.json({ message: 'Problem deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc  Mark a revision as complete and schedule next date
// @route POST /api/problems/:id/revise
const reviseProblem = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);

        if (!problem) return res.status(404).json({ message: 'Problem not found' });

        if (problem.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Apply fixed-interval schedule
        const updates = calculateNextRevision(problem);
        Object.assign(problem, updates);
        problem.lastReviewed = new Date();
        const updated = await problem.save();

        const intervalMap = [1, 3, 7, 14, 30];
        const nextInterval = intervalMap[Math.min(updated.revisionCount, intervalMap.length - 1)];

        res.json({
            problem: updated,
            message: `Revision #${updated.revisionCount} logged. Next revision in ${nextInterval} day(s).`,
            nextRevisionDate: updated.nextRevisionDate,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc  Get daily reminders (problems due specifically today)
// @route GET /api/problems/reminders
const getDailyReminders = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const problems = await Problem.find({
            user: req.user._id,
            nextRevisionDate: { $gte: startOfDay, $lte: endOfDay },
        }).sort({ difficulty: 1 });

        res.json({
            count: problems.length,
            reminders: problems,
            message: problems.length > 0
                ? `You have ${problems.length} problems to revise today!`
                : "No revisions due specifically for today. Enjoy your day!",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc  Get calendar schedule grouped by date
// @route GET /api/problems/calendar
const getCalendarSchedule = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Fetch problems where nextRevisionDate is today or in the future
        const problems = await Problem.find({
            user: req.user._id,
            nextRevisionDate: { $gte: today },
        }).sort({ nextRevisionDate: 1 });

        // Group by YYYY-MM-DD
        const schedule = {};
        
        problems.forEach(p => {
            if (p.nextRevisionDate) {
                const dateStr = p.nextRevisionDate.toISOString().split('T')[0];
                if (!schedule[dateStr]) {
                    schedule[dateStr] = [];
                }
                schedule[dateStr].push(p.title);
            }
        });

        res.json(schedule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc  Update personal notes for a problem
// @route POST /api/problems/:id/notes
const updateNotes = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);

        if (!problem) return res.status(404).json({ message: 'Problem not found' });

        if (problem.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { notes, approach, bruteForce, optimizedApproach, mistakes, optimizedSolution } = req.body;

        if (notes !== undefined) problem.notes = notes;
        if (approach !== undefined) problem.approach = approach;
        if (bruteForce !== undefined) problem.bruteForce = bruteForce;
        if (optimizedApproach !== undefined) problem.optimizedApproach = optimizedApproach;
        if (mistakes !== undefined) problem.mistakes = mistakes;
        if (optimizedSolution !== undefined) problem.optimizedSolution = optimizedSolution;

        const updated = await problem.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
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
};
