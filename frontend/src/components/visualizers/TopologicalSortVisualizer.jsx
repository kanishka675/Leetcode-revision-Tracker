import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopologicalSortVisualizer() {
    const [nodes] = useState(['A', 'B', 'C', 'D', 'E']);
    const [edges] = useState([
        { from: 'A', to: 'C' },
        { from: 'B', to: 'C' },
        { from: 'B', to: 'D' },
        { from: 'C', to: 'E' },
        { from: 'D', to: 'E' }
    ]);
    const [indegree, setIndegree] = useState({ A: 0, B: 0, C: 2, D: 1, E: 2 });
    const [queue, setQueue] = useState([]);
    const [result, setResult] = useState([]);
    const [status, setStatus] = useState('Wait');

    const handleNext = () => {
        if (status === 'Wait') {
            setStatus('Running');
            const initialQueue = nodes.filter(n => indegree[n] === 0);
            setQueue(initialQueue);
            return;
        }

        if (queue.length === 0) {
            setStatus('Over');
            return;
        }

        const [curr, ...rest] = queue;
        const nextResult = [...result, curr];
        const nextIndegree = { ...indegree };
        const nextQueue = [...rest];

        // Find neighbors
        edges.filter(e => e.from === curr).forEach(edge => {
            nextIndegree[edge.to]--;
            if (nextIndegree[edge.to] === 0) {
                nextQueue.push(edge.to);
            }
        });

        setResult(nextResult);
        setIndegree(nextIndegree);
        setQueue(nextQueue);

        if (nextQueue.length === 0 && nextResult.length === nodes.length) {
            setStatus('Over');
        }
    };

    const reset = () => {
        setIndegree({ A: 0, B: 0, C: 2, D: 1, E: 2 });
        setQueue([]);
        setResult([]);
        setStatus('Wait');
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-12">
            <div className="text-center space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Kahn's Algorithm (Topological Sort)</p>
                <p className="text-sm font-medium text-slate-400">
                    {status === 'Wait' ? 'Sort Directed Acyclic Graph nodes by dependencies' : 
                     status === 'Over' ? 'Sort Complete!' : 
                     `Processing Node ${queue[0]}. Queue: [${queue.join(', ')}]`}
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-12 items-center w-full justify-center">
                {/* Graph Visualization */}
                <div className="relative w-64 h-64 bg-slate-900/30 rounded-3xl border border-white/5 p-4 flex flex-wrap gap-4 items-center justify-center">
                    {nodes.map(node => {
                        const inDeg = indegree[node];
                        const isProcessed = result.includes(node);
                        const isInQueue = queue.includes(node);
                        return (
                            <motion.div
                                key={node}
                                animate={{
                                    scale: isInQueue ? 1.1 : 1,
                                    opacity: isProcessed ? 0.3 : 1,
                                    borderColor: isInQueue ? '#0ea5e9' : 'rgba(255,255,255,0.1)',
                                    backgroundColor: isInQueue ? 'rgba(14, 165, 233, 0.2)' : 'rgba(31, 41, 55, 0.8)'
                                }}
                                className="w-12 h-12 rounded-full border-2 flex flex-col items-center justify-center shadow-lg"
                            >
                                <span className="font-black text-slate-100">{node}</span>
                                <span className="text-[8px] text-slate-500">In: {inDeg}</span>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Result Order */}
                <div className="flex flex-col items-center gap-4">
                    <span className="text-[10px] font-black uppercase text-slate-600">Topological Order</span>
                    <div className="flex gap-2 min-h-[3rem] items-center p-4 bg-slate-800/20 rounded-xl border border-white/5">
                        <AnimatePresence>
                            {result.map(node => (
                                <motion.div
                                    key={node}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg"
                                >
                                    {node}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <button onClick={handleNext} disabled={status === 'Over'} className="btn-primary px-8">
                    {status === 'Wait' ? 'Start' : 'Next Step'}
                </button>
                <button onClick={reset} className="btn-secondary px-8">Reset</button>
            </div>
        </div>
    );
}
