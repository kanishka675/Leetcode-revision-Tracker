const Problem = require('../models/Problem');

// @desc  Get dashboard stats
// @route GET /api/dashboard
const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

        const today = new Date();
        today.setHours(23, 59, 59, 999);

        const [totalSolved, dueToday, allProblems] = await Promise.all([
            Problem.countDocuments({ user: userId }),
            Problem.countDocuments({ user: userId, nextRevisionDate: { $lte: today } }),
            Problem.find({ user: userId }, 'topics difficulty'),
        ]);

        // Topic distribution
        const topicDistribution = {};
        allProblems.forEach((p) => {
            p.topics.forEach((topic) => {
                topicDistribution[topic] = (topicDistribution[topic] || 0) + 1;
            });
        });

        // Difficulty distribution
        const difficultyDistribution = { Easy: 0, Medium: 0, Hard: 0 };
        allProblems.forEach((p) => {
            if (p.difficulty) difficultyDistribution[p.difficulty]++;
        });

        // Recently added (last 5)
        const recentProblems = await Problem.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title difficulty topics nextRevisionDate');

        res.json({
            totalSolved,
            dueToday,
            topicDistribution,
            difficultyDistribution,
            recentProblems,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats };
