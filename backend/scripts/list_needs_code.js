const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Problem = require('../models/Problem');

dotenv.config();

const listDebuggableProblems = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const problems = await Problem.find({}, 'title leetcodeUrl optimizedSolution approach optimizedApproach');
        
        const needsCode = problems.filter(p => {
            const code = p.optimizedSolution || p.optimizedApproach || p.approach || "";
            return code.length < 10 && p.leetcodeUrl;
        });

        console.log('--- PROBLEMS NEEDING CODE ---');
        console.log(JSON.stringify(needsCode, null, 2));
        
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listDebuggableProblems();
