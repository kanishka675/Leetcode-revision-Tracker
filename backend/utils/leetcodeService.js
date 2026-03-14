const axios = require('axios');

/**
 * Extracts the problem slug from a LeetCode URL.
 * URL format: https://leetcode.com/problems/problem-slug/description/
 */
const extractSlug = (url) => {
    try {
        const parts = url.split('/problems/');
        if (parts.length < 2) return null;
        return parts[1].split('/')[0];
    } catch (error) {
        return null;
    }
};

/**
 * Fetches solution code from a public GitHub repository (walkccc/leetcode).
 * This repository is a reliable source for Python/C++/Java solutions.
 * We'll try to fetch the Python solution as it's often the most readable for debugging logic.
 */
const fetchSolutionFromGithub = async (slug) => {
    try {
        // walkccc/leetcode uses kebab-case slugs
        // Pattern: https://raw.githubusercontent.com/walkccc/leetcode/main/solutions/[id].md?
        // Actually, walkccc uses a specific structure. Let's try another common one:
        // leetcode-solutions/leetcode-solutions/blob/master/solutions/[id].py
        
        // A more direct way is to search GitHub or use a specific reliable source.
        // For this implementation, we'll use the 'walkccc/leetcode' repository structure.
        // It's organized by problem number, so we might need the ID too.
        
        // If we only have the slug, we can try to fetch the problem description/metadata first
        // to get the ID, but that's complex. 
        
        // Let's try a different strategy: Fetch from a known reliable API or repository that uses slugs.
        // GitHub Search API is rate-limited but could work for slugs.
        
        // Alternative: Use 'leetcode-js' or similar if it were installed.
        // For now, let's implement a robust extractor for the walkccc structure if possible,
        // or a generic search.
        
        // Strategy: Use 'https://raw.githubusercontent.com/doocs/leetcode/main/solution/[number000-number999]/[id].[slug]/README.md'
        // This is also complex.
        
        // Simpler reliable source for slugs: 
        // https://raw.githubusercontent.com/algorithm-visualizer/algorithm-visualizer/master/algorithms/...
        // Actually, let's use a very simple and direct one:
        // https://raw.githubusercontent.com/neetcode-gh/leetcode/main/python/[slug].py
        // (Wait, NeetCode uses slug.py for many problems)

        const neetCodeUrl = `https://raw.githubusercontent.com/neetcode-gh/leetcode/main/python/${slug}.py`;
        const response = await axios.get(neetCodeUrl);
        
        if (response.data && response.data.length > 50) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error(`NeetCode fetch failed for ${slug}:`, error.message);
        
        // Try fallback 2: WalkCCC (Python)
        // Note: This often requires the problem number, which we might not have yet.
        return null;
    }
};

module.exports = {
    extractSlug,
    fetchSolutionFromGithub
};
