const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Algorithm = require('../models/Algorithm');

dotenv.config();

const algorithms = [
    {
        name: 'two-pointer',
        title: 'Two Pointer',
        explanation: 'The Two Pointer technique involves using two indices to traverse a data structure (usually an array or linked list) from different positions or at different speeds.',
        exampleProblem: {
            title: 'Two Sum II',
            url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/'
        },
        type: 'array',
        steps: [
            { label: 'Initialize', description: 'Start with one pointer at the beginning (left) and one at the end (right).' },
            { label: 'Check Sum', description: 'Calculate the sum of elements at both pointers.' },
            { label: 'Ajust Pointers', description: 'If sum > target, move right pointer left. If sum < target, move left pointer right.' }
        ]
    },
    {
        name: 'sliding-window',
        title: 'Sliding Window',
        explanation: 'Sliding Window is used to perform operations on a specific window size of a linear data structure, which "slides" as you traverse.',
        exampleProblem: {
            title: 'Max Sum Subarray',
            url: 'https://leetcode.com/problems/maximum-subarray/'
        },
        type: 'array',
        steps: [
            { label: 'Start Window', description: 'Define the start and end of your current window.' },
            { label: 'Expand', description: 'Move the end pointer to include more elements.' },
            { label: 'Contract', description: 'Move the start pointer to maintain window constraints.' }
        ]
    },
    {
        name: 'binary-search',
        title: 'Binary Search',
        explanation: 'Binary Search is an efficient algorithm for finding an item from a sorted list of items by repeatedly dividing the search interval in half.',
        exampleProblem: {
            title: 'Binary Search',
            url: 'https://leetcode.com/problems/binary-search/'
        },
        type: 'array',
        steps: [
            { label: 'Range', description: 'Set low to 0 and high to array length - 1.' },
            { label: 'Midpoint', description: 'Calculate mid = low + (high - low) / 2.' },
            { label: 'Compare', description: 'If mid is target, return. If target < mid, search left half. If target > mid, search right half.' }
        ]
    },
    {
        name: 'bfs',
        title: 'Breadth First Search',
        explanation: 'BFS explores a graph level by level, visiting all neighbors of a node before moving to the next level.',
        exampleProblem: {
            title: 'Level Order Traversal',
            url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/'
        },
        type: 'graph',
        steps: [
            { label: 'Queue', description: 'Add starting node to a queue and mark it as visited.' },
            { label: 'Process', description: 'Dequeue a node and visit all its unvisited neighbors.' },
            { label: 'Repeat', description: 'Repeat until the queue is empty.' }
        ]
    },
    {
        name: 'dfs',
        title: 'Depth First Search',
        explanation: 'DFS explores a graph by going as deep as possible along each branch before backtracking.',
        exampleProblem: {
            title: 'Islands Count',
            url: 'https://leetcode.com/problems/number-of-islands/'
        },
        type: 'graph',
        steps: [
            { label: 'Stack/Recursion', description: 'Visit a node and recursively visit each of its neighbors.' },
            { label: 'Backtrack', description: 'When a node has no unvisited neighbors, backtrack to the previous node.' }
        ]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB for seeding...');
        
        await Algorithm.deleteMany();
        console.log('Cleared existing algorithms.');
        
        await Algorithm.insertMany(algorithms);
        console.log('Inserted algorithms metadata!');
        
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
