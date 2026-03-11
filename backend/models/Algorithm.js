const mongoose = require('mongoose');

const algorithmSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        required: true
    },
    exampleProblem: {
        title: String,
        url: String
    },
    type: {
        type: String,
        enum: ['array', 'graph', 'other'],
        default: 'array'
    },
    steps: [{
        label: String,
        description: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('Algorithm', algorithmSchema);
