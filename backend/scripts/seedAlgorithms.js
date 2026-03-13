const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Algorithm = require('../models/Algorithm');

dotenv.config({ path: path.join(__dirname, '../.env') });

const newAlgorithms = [
    {
        name: 'monotonic-stack',
        title: 'Monotonic Stack',
        explanation: 'A stack that maintains elements in a specific order (increasing or decreasing). Useful for finding the next greater or smaller element in an array.',
        exampleProblem: {
            title: 'Next Greater Element I',
            url: 'https://leetcode.com/problems/next-greater-element-i/'
        },
        type: 'array',
        steps: [
            { label: 'Push/Pop', description: 'Maintain order by popping elements smaller/larger than the current element.' },
            { label: 'Next Greater', description: 'The top of the stack is the next greater element for the current value.' },
            { label: 'O(n) Time', description: 'Each element is pushed and popped at most once.' }
        ]
    },
    {
        name: 'heap-priority-queue',
        title: 'Heap / Priority Queue',
        explanation: 'A specialized tree-based data structure that satisfies the heap property. Used for efficiently finding the minimum or maximum element.',
        exampleProblem: {
            title: 'Kth Largest Element in an Array',
            url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/'
        },
        type: 'other',
        steps: [
            { label: 'Insert', description: 'Add element to the end and "bubble up" to maintain heap property.' },
            { label: 'Extract Min/Max', description: 'Remove the root and "bubble down" the last element from the root.' },
            { label: 'Heapify', description: 'Convert an arbitrary array into a heap structure in O(n) time.' }
        ]
    },
    {
        name: 'kadanes-algorithm',
        title: "Kadane's Algorithm",
        explanation: "Efficiently finds the maximum sum subarray within a one-dimensional array of numbers.",
        exampleProblem: {
            title: 'Maximum Subarray',
            url: 'https://leetcode.com/problems/maximum-subarray/'
        },
        type: 'array',
        steps: [
            { label: 'Local Max', description: 'current_sum = max(x, current_sum + x)' },
            { label: 'Global Max', description: 'max_sum = max(max_sum, current_sum)' },
            { label: 'O(n) Time', description: 'Finds the solution in a single pass through the array.' }
        ]
    },
    {
        name: 'union-find',
        title: 'Union Find (Disjoint Set)',
        explanation: 'Stores a collection of disjoint sets and provides operations to find the set an element belongs to and unite two sets.',
        exampleProblem: {
            title: 'Number of Provinces',
            url: 'https://leetcode.com/problems/number-of-provinces/'
        },
        type: 'graph',
        steps: [
            { label: 'Find', description: 'Determine which set an element belongs to, often with path compression.' },
            { label: 'Union', description: 'Unite two sets into a single set, often by rank or size.' },
            { label: 'Path Compression', description: 'Flatten the tree structure during find operations for efficiency.' }
        ]
    },
    {
        name: 'dp-grid',
        title: 'DP Grid Pattern',
        explanation: 'A common Dynamic Programming technique where a 2D grid is used to store subproblem results, often for pathfinding or grid-based problems.',
        exampleProblem: {
            title: 'Unique Paths',
            url: 'https://leetcode.com/problems/unique-paths/'
        },
        type: 'other',
        steps: [
            { label: 'Initialization', description: 'Fill the base cases (e.g., first row and first column).' },
            { label: 'Recurrence', description: 'Calculate dp[i][j] based on previously computed neighbors.' },
            { label: 'Final Result', description: 'The answer is usually found at the last cell (bottom-right).' }
        ]
    },
    {
        name: 'merge-intervals',
        title: 'Merge Intervals',
        explanation: 'Dealing with overlapping intervals by merging them into a single interval covering the entire range.',
        exampleProblem: {
            title: 'Merge Intervals',
            url: 'https://leetcode.com/problems/merge-intervals/'
        },
        type: 'array',
        steps: [
            { label: 'Sort', description: 'Sort intervals based on their start times.' },
            { label: 'Check Overlap', description: 'If current interval starts before the previous one ends, they overlap.' },
            { label: 'Merge', description: 'Combine overlapping intervals by updating the end time.' }
        ]
    },
    {
        name: 'topological-sort',
        title: 'Topological Sort',
        explanation: 'Linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge uv, vertex u comes before v.',
        exampleProblem: {
            title: 'Course Schedule II',
            url: 'https://leetcode.com/problems/course-schedule-ii/'
        },
        type: 'graph',
        steps: [
            { label: 'Indegree', description: 'Calculate the number of incoming edges for each node.' },
            { label: 'Queue', description: 'Add all nodes with 0 indegree to the queue.' },
            { label: 'Process', description: 'Remove node from queue, add to result, and decrement neighbors indegrees.' }
        ]
    },
    {
        name: 'trie',
        title: 'Trie (Prefix Tree)',
        explanation: 'A tree-like data structure used to efficiently store and search strings, especially for prefix matching.',
        exampleProblem: {
            title: 'Implement Trie (Prefix Tree)',
            url: 'https://leetcode.com/problems/implement-trie-prefix-tree/'
        },
        type: 'other',
        steps: [
            { label: 'Insert', description: 'Traverse/create nodes for each character in the string.' },
            { label: 'Search', description: 'Follow characters through the tree; if all exist and mark end, word is found.' },
            { label: 'Prefix Search', description: 'Check if a sequence of characters exists as a path in the trie.' }
        ]
    },
    {
        name: 'bit-manipulation',
        title: 'Bit Manipulation',
        explanation: 'Operating on data at the bit level using bitwise operators like AND, OR, XOR, and shifts.',
        exampleProblem: {
            title: 'Single Number',
            url: 'https://leetcode.com/problems/single-number/'
        },
        type: 'other',
        steps: [
            { label: 'XOR Trick', description: 'x ^ x = 0; x ^ 0 = x. Useful for finding unique elements.' },
            { label: 'Bit Shifting', description: 'Move bits left (multiply by 2) or right (divide by 2).' },
            { label: 'Masking', description: 'Use bitwise AND with a mask to extract or set specific bits.' }
        ]
    },
    {
        name: 'greedy',
        title: 'Greedy Algorithm',
        explanation: 'Making the locally optimal choice at each step with the hope that these choices lead to a globally optimal solution.',
        exampleProblem: {
            title: 'Jump Game',
            url: 'https://leetcode.com/problems/jump-game/'
        },
        type: 'algorithm',
        steps: [
            { label: 'Local Optimum', description: 'Choose the best option available at the current moment.' },
            { label: 'Greedy Choice', description: 'Assume local optimum will lead to global optimum.' },
            { label: 'Feasibility', description: 'Ensure the choice satisfies the problem constraints.' }
        ]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        for (const alg of newAlgorithms) {
            await Algorithm.findOneAndUpdate(
                { name: alg.name },
                alg,
                { upsert: true, new: true }
            );
            console.log(`Seeded/Updated: ${alg.title}`);
        }

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
