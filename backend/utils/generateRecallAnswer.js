/**
 * Generates suggested answers for flashcards based on problem patterns and difficulty.
 * @param {Object} problem - The problem document from MongoDB.
 * @returns {Object} - Suggested dataStructure, timeComplexity, and keyAlgorithmIdea.
 */
const generateRecallAnswer = (problem) => {
    const topics = problem.topics || [];
    const difficulty = problem.difficulty || 'Medium';

    // Priority mappings for patterns
    const patternMappings = {
        'Hash Map': {
            ds: 'Hash Map / Unordered Map',
            tc: 'O(n)',
            idea: 'Store previously seen values in a map and check if the complement (target - current) exists.'
        },
        'Two Pointers': {
            ds: 'Two Pointers',
            tc: 'O(n)',
            idea: 'Move two pointers (usually from ends or together) to satisfy a specific condition or find a range.'
        },
        'Sliding Window': {
            ds: 'Window + Array/String',
            tc: 'O(n)',
            idea: 'Maintain a moving window and expand/shrink it while maintaining constraints to find optimal subsegments.'
        },
        'Binary Search': {
            ds: 'Sorted Array + Two Pointers',
            tc: 'O(log n)',
            idea: 'Repeatedly divide the search space in half by comparing the middle element with the target.'
        },
        'Heap': {
            ds: 'Priority Queue (Min/Max Heap)',
            tc: 'O(n log k) or O(n log n)',
            idea: 'Use a heap to efficiently find the K-th smallest/largest element or maintain a sorted set of elements.'
        },
        'Trie': {
            ds: 'Trie (Prefix Tree)',
            tc: 'O(n * L) where L is the average word length',
            idea: 'Store characters at tree nodes to provide efficient prefix-based searching and insertions.'
        },
        'Graphs': {
            ds: 'Adjacency List / Matrix',
            tc: 'O(V + E)',
            idea: 'Use BFS for shortest paths in unweighted graphs or DFS for exhaustive search and connectivity.'
        },
        'DP': {
            ds: '1D/2D DP Table or Memoization Map',
            tc: 'O(n * m)',
            idea: 'Break down the problem into overlapping subproblems and store their results to avoid redundant calculations.'
        },
        'Recursion': {
            ds: 'Recursion Stack',
            tc: 'O(2^n) or O(n!)',
            idea: 'Solve the problem by calling the same function with smaller subproblems until reaching a base case.'
        },
        'Backtracking': {
            ds: 'Recursion Stack + State Tracking',
            tc: 'O(K^n)',
            idea: 'Systematically explore all possible configurations and "backtrack" when a configuration fails to meet constraints.'
        }
    };

    // Find the first matching topic
    for (const topic of topics) {
        if (patternMappings[topic]) {
            return patternMappings[topic];
        }
    }

    // Fallback based on difficulty if no pattern matches
    const fallbacks = {
        'Easy': {
            ds: 'Hash Map or Two Pointers',
            tc: 'O(n)',
            idea: 'Usually involves a single pass with a frequency map or simple pointer traversal.'
        },
        'Medium': {
            ds: 'Sliding Window or Binary Search',
            tc: 'O(n) or O(log n)',
            idea: 'Look for optimal subarrays or search for a value in a sorted/constrained space.'
        },
        'Hard': {
            ds: 'Dynamic Programming or Graph DFS',
            tc: 'O(n^2) or O(V+E)',
            idea: 'Requires breaking the problem into subproblems or navigating complex relationships/states.'
        }
    };

    return fallbacks[difficulty] || fallbacks['Medium'];
};

module.exports = generateRecallAnswer;
