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
    },
    {
        name: 'fast-slow-pointers',
        title: 'Fast & Slow Pointers',
        explanation: 'Also known as the Tortoise and Hare algorithm, it uses two pointers moving at different speeds to detect cycles or find the middle of a data structure.',
        exampleProblem: {
            title: 'Linked List Cycle',
            url: 'https://leetcode.com/problems/linked-list-cycle/'
        },
        type: 'linked-list',
        steps: [
            { label: 'Initialize', description: 'Set both slow and fast pointers to the head.' },
            { label: 'Move', description: 'Move slow by 1 step and fast by 2 steps.' },
            { label: 'Detect', description: 'If pointers meet, a cycle exists. If fast reaches the end, no cycle exists.' }
        ]
    },
    {
        name: 'cyclic-sort',
        title: 'Cyclic Sort',
        explanation: 'An efficient O(N) sort for arrays containing numbers in a given range (e.g., 1 to N), by placing each number at its correct index.',
        exampleProblem: {
            title: 'Missing Number',
            url: 'https://leetcode.com/problems/missing-number/'
        },
        type: 'array',
        steps: [
            { label: 'Verify Position', description: 'Check if the number at the current index is in its correct place (val - 1).' },
            { label: 'Swap', description: 'If not correct, swap it with the number at its target index.' },
            { label: 'Iterate', description: 'Repeat until the current number is correct, then move to the next index.' }
        ]
    },
    {
        name: 'divide-conquer',
        title: 'Divide & Conquer',
        explanation: 'A paradigm that breaks a problem into smaller subproblems, solves them recursively, and combines the results (e.g., Merge Sort, Quick Sort).',
        exampleProblem: {
            title: 'Merge Sort',
            url: 'https://leetcode.com/problems/sort-an-array/'
        },
        type: 'algorithm',
        steps: [
            { label: 'Divide', description: 'Break the problem into smaller subproblems of the same type.' },
            { label: 'Conquer', description: 'Solve subproblems recursively (base case: trivial subproblem).' },
            { label: 'Combine', description: 'Merge subproblem solutions to solve the original problem.' }
        ]
    },
    {
        name: 'prefix-sum',
        title: 'Prefix Sum',
        explanation: 'A technique that stores cumulative sums in an array to allow O(1) time complexity for range sum queries.',
        exampleProblem: {
            title: 'Range Sum Query',
            url: 'https://leetcode.com/problems/range-sum-query-immutable/'
        },
        type: 'array',
        steps: [
            { label: 'Build', description: 'Create an array where each index i stores the sum of all elements up to i.' },
            { label: 'Query', description: 'Sum of range [L, R] is prefix[R] - prefix[L-1].' }
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
