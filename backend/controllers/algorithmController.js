const Algorithm = require('../models/Algorithm');

// @desc  Get all algorithms
// @route GET /api/algorithms
const getAlgorithms = async (req, res) => {
    try {
        const algorithms = await Algorithm.find();
        res.json(algorithms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc  Get algorithm by name
// @route GET /api/algorithms/:name
const getAlgorithmByName = async (req, res) => {
    try {
        const algorithm = await Algorithm.findOne({ name: req.params.name });
        if (!algorithm) return res.status(404).json({ message: 'Algorithm not found' });
        res.json(algorithm);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAlgorithms,
    getAlgorithmByName
};
