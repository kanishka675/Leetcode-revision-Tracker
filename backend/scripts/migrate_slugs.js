const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Problem = require('../models/Problem.js');
const { extractSlug } = require('../utils/leetcodeService.js');

dotenv.config();

const migrateSlugs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const problems = await Problem.find({ leetcodeUrl: { $exists: true }, leetcodeSlug: { $exists: false } });
        console.log(`Found ${problems.length} problems to update slugs.`);

        for (const problem of problems) {
            const slug = extractSlug(problem.leetcodeUrl);
            if (slug) {
                problem.leetcodeSlug = slug;
                await problem.save();
                console.log(`Updated slug for: ${problem.title} -> ${slug}`);
            }
        }

        console.log('Migration complete.');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

migrateSlugs();
