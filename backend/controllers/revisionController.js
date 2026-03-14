const Problem = require('../models/Problem');
const { injectBug } = require('../utils/bugInjector');
const { extractSlug, fetchSolutionFromGithub } = require('../utils/leetcodeService');
const { calculateNextRevision } = require('../utils/spacedRepetition');

// @desc  Get a debug session for a problem
// @route POST /api/revision/debug/:id
const getDebugSession = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) return res.status(404).json({ message: 'Problem not found' });
        if (problem.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const codeToBug = problem.optimizedSolution || problem.optimizedApproach || problem.approach || "";
        
        if (!codeToBug || codeToBug.length < 10) {
            return res.status(400).json({ message: 'Solution code is too short or missing to generate a bug.' });
        }

        const { buggyCode, hint } = injectBug(codeToBug);

        res.json({
            problemTitle: problem.title,
            buggyCode,
            hint,
            originalCode: codeToBug
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc  Verify if the fixed code matches the original solution
// @route POST /api/revision/verify/:id
const verifyFix = async (req, res) => {
    try {
        const { fixedCode } = req.body;
        const problem = await Problem.findById(req.params.id);

        if (!problem) return res.status(404).json({ message: 'Problem not found' });

        const originalCode = problem.optimizedSolution || problem.optimizedApproach || problem.approach || "";

        // Normalize strings for comparison (remove whitespace/newlines)
        const normalize = (str) => str.replace(/\s+/g, '').trim();
        
        const isCorrect = normalize(fixedCode) === normalize(originalCode);

        if (isCorrect) {
            // Update revision stats
            problem.revisionAttempts = (problem.revisionAttempts || 0) + 1;
            problem.debugSolved = true;
            
            // Also trigger normal revision update if not already done recently
            const updates = calculateNextRevision(problem);
            Object.assign(problem, updates);
            problem.lastReviewed = new Date();
            
            await problem.save();

            res.json({ 
                success: true, 
                message: 'Awesome! You fixed the bug correctly.',
                problem 
            });
        } else {
            res.json({ 
                success: false, 
                message: 'Logic still seems incorrect. Compare carefully with the expected logic.' 
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc  Fetch and store solution from LeetCode Reference
// @route POST /api/revision/fetch-solution/:id
const fetchSolution = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) return res.status(404).json({ message: 'Problem not found' });

        if (!problem.leetcodeUrl) {
            return res.status(400).json({ message: 'No LeetCode URL provided for this problem.' });
        }

        const slug = problem.leetcodeSlug || extractSlug(problem.leetcodeUrl);
        if (!slug) return res.status(400).json({ message: 'Invalid LeetCode URL format.' });

        const code = await fetchSolutionFromGithub(slug);
        
        if (code) {
            problem.optimizedSolution = code;
            problem.leetcodeSlug = slug;
            await problem.save();
            return res.json({ success: true, message: 'Solution fetched and saved!', code });
        } else {
            return res.status(404).json({ message: 'Could not find a public solution for this slug yet.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDebugSession,
    verifyFix,
    fetchSolution
};
