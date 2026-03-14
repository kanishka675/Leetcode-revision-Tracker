import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import VisualizerControls from './VisualizerControls';

export default function BinaryTreeTraversalVisualizer() {
    // Tree Structure: 
    //        1
    //      /   \
    //     2     3
    //    / \   / \
    //   4   5 6   7
    const tree = {
        val: 1, x: 50, y: 10,
        left: { val: 2, x: 25, y: 40, left: { val: 4, x: 12.5, y: 80, left: null, right: null }, right: { val: 5, x: 37.5, y: 80, left: null, right: null } },
        right: { val: 3, x: 75, y: 40, left: { val: 6, x: 62.5, y: 80, left: null, right: null }, right: { val: 7, x: 87.5, y: 80, left: null, right: null } }
    };

    const edges = [
        { from: [50, 10], to: [25, 40] },
        { from: [50, 10], to: [75, 40] },
        { from: [25, 40], to: [12.5, 80] },
        { from: [25, 40], to: [37.5, 80] },
        { from: [75, 40], to: [62.5, 80] },
        { from: [75, 40], to: [87.5, 80] }
    ];

    const nodes = [1, 2, 3, 4, 5, 6, 7].map(v => {
        const findNode = (n) => {
            if (!n) return null;
            if (n.val === v) return n;
            return findNode(n.left) || findNode(n.right);
        };
        return findNode(tree);
    });

    const [mode, setMode] = useState('inorder'); // preorder, inorder, postorder
    
    const steps = useMemo(() => {
        let history = [];
        let visited = [];

        const traverse = (node) => {
            if (!node) return;

            history.push({ currentNode: node.val, visited: [...visited], message: `Visiting Node ${node.val}` });

            if (mode === 'preorder') {
                visited.push(node.val);
                history.push({ currentNode: node.val, visited: [...visited], message: `[Preorder] Added ${node.val} to result` });
            }

            if (node.left) {
                history.push({ currentNode: node.val, nextNode: node.left.val, visited: [...visited], message: `Going Left from ${node.val} to ${node.left.val}` });
                traverse(node.left);
                history.push({ currentNode: node.val, visited: [...visited], message: `Returned backtracking to ${node.val} from left` });
            }

            if (mode === 'inorder') {
                visited.push(node.val);
                history.push({ currentNode: node.val, visited: [...visited], message: `[Inorder] Added ${node.val} to result` });
            }

            if (node.right) {
                history.push({ currentNode: node.val, nextNode: node.right.val, visited: [...visited], message: `Going Right from ${node.val} to ${node.right.val}` });
                traverse(node.right);
                history.push({ currentNode: node.val, visited: [...visited], message: `Returned backtracking to ${node.val} from right` });
            }

            if (mode === 'postorder') {
                visited.push(node.val);
                history.push({ currentNode: node.val, visited: [...visited], message: `[Postorder] Added ${node.val} to result` });
            }
        };

        history.push({ currentNode: null, visited: [], message: `Starting ${mode} traversal...` });
        traverse(tree);
        history.push({ currentNode: null, visited: [...visited], message: `Finished ${mode} traversal! Final Result: [${visited.join(', ')}]` });

        return history;
    }, [mode]);

    const [currentStep, setCurrentStep] = useState(0);
    const [status, setStatus] = useState('Wait');
        
    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
            setStatus('Running');
        } else {
            setStatus('Over');
                    }
    };

    
    const reset = () => {
        setCurrentStep(0);
        setStatus('Wait');
            };

    useEffect(() => {
        reset();
    }, [mode]);

    const stepData = steps[currentStep] || steps[0];
    const currentNode = stepData.currentNode;
    const nextNode = stepData.nextNode;
    const visited = stepData.visited || [];
    const message = stepData.message;

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden">
            <div className="text-center space-y-2 mb-8">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Binary Tree Traversal</p>
                
                <div className="flex justify-center gap-4 my-4">
                    {['preorder', 'inorder', 'postorder'].map(m => (
                        <button
                            key={m}
                            onClick={() => { setMode(m); reset(); }}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                                mode === m 
                                    ? 'bg-brand-500/20 text-brand-400 border-brand-500/50 shadow-lg shadow-brand-500/10' 
                                    : 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700'
                            }`}
                        >
                            {m}
                        </button>
                    ))}
                </div>

                <p className="text-lg font-bold text-slate-300 max-w-lg mx-auto min-h-[3rem]">{message}</p>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-12 w-full max-w-5xl">
                {/* Tree Visualization */}
                <div className="relative w-full max-w-md h-64 border border-white/5 bg-slate-800/20 rounded-2xl flex-shrink-0">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {edges.map((edge, i) => {
                            const isTraversing = (currentNode === tree.val && nextNode === tree.left.val) || false; // simplifies to all edges dim
                            return (
                                <line 
                                    key={i} 
                                    x1={`${edge.from[0]}%`} 
                                    y1={`${edge.from[1]}%`} 
                                    x2={`${edge.to[0]}%`} 
                                    y2={`${edge.to[1]}%`} 
                                    stroke="rgba(255,255,255,0.1)" 
                                    strokeWidth="2" 
                                />
                            );
                        })}
                    </svg>

                    {nodes.map((node) => {
                        const isCurrent = currentNode === node.val;
                        const isVisited = visited.includes(node.val);
                        
                        return (
                            <motion.div
                                key={node.val}
                                animate={{
                                    scale: isCurrent ? 1.2 : 1,
                                    backgroundColor: isCurrent ? 'rgba(234, 179, 8, 0.9)' : 
                                                     isVisited ? 'rgba(16, 185, 129, 0.8)' : 'rgba(31, 41, 55, 0.9)',
                                    borderColor: isCurrent ? '#facc15' : isVisited ? '#10b981' : 'rgba(14, 165, 233, 0.5)'
                                }}
                                className="absolute w-12 h-12 -ml-6 -mt-6 rounded-full border-2 flex items-center justify-center font-black text-slate-100 shadow-xl transition-colors duration-300 z-10"
                                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                            >
                                {node.val}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Traversal Result Array */}
                <div className="flex flex-col items-center gap-2 w-full max-w-sm">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Result Array</span>
                    <div className="flex flex-wrap justify-center gap-2 min-h-[3rem] w-full p-4 bg-slate-800/50 rounded-xl border border-white/5">
                        {visited.length === 0 && <span className="text-slate-600 text-sm italic">Empty</span>}
                        {visited.map((val, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 rounded-lg flex items-center justify-center font-black"
                            >
                                {val}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <VisualizerControls 
                onNext={handleNext}
                onReset={reset}
                status={status}
            />
        </div>
    );
}
