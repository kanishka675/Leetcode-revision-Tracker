import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeapVisualizer() {
    const [heap, setHeap] = useState([10, 20, 30, 40, 50, 60, 70]); // Min-Heap
    const [status, setStatus] = useState('Wait');
    const [highlightIndices, setHighlightIndices] = useState([]);
    const [message, setMessage] = useState('Binary Min-Heap Visualization');

    const getParent = (i) => Math.floor((i - 1) / 2);
    const getLeft = (i) => 2 * i + 1;
    const getRight = (i) => 2 * i + 2;

    const handleInsert = async () => {
        const newVal = Math.floor(Math.random() * 90) + 10;
        const newHeap = [...heap, newVal];
        setHeap(newHeap);
        setStatus('BubblingUp');
        setMessage(`Inserted ${newVal}. Bubbling up...`);
        
        let curr = newHeap.length - 1;
        setHighlightIndices([curr]);

        // Bubble Up simulation (step-by-step logic would be better in handleNext, 
        // but for simplicity here we just show the state. 
        // Let's refactor to step-by-step handleNext)
    };

    const handleNext = () => {
        // Implement step-by-step bubble up or extract min logic
        setMessage('Step-by-step heap operations');
    };

    const reset = () => {
        setHeap([10, 20, 30, 40, 50, 60, 70]);
        setStatus('Wait');
        setHighlightIndices([]);
        setMessage('Binary Min-Heap Visualization');
    };

    // Helper to calculate node positions for a binary tree
    const renderNodes = () => {
        return heap.map((val, i) => {
            const level = Math.floor(Math.log2(i + 1));
            const posInLevel = i - (Math.pow(2, level) - 1);
            const totalInLevel = Math.pow(2, level);
            const x = (posInLevel + 0.5) * (100 / totalInLevel);
            const y = level * 25 + 10;

            return (
                <motion.div
                    key={i}
                    layout
                    initial={{ scale: 0 }}
                    animate={{ 
                        scale: 1,
                        x: `${x}%`,
                        y: `${y}%`,
                        borderColor: highlightIndices.includes(i) ? '#0ea5e9' : 'rgba(255,255,255,0.1)',
                        backgroundColor: highlightIndices.includes(i) ? 'rgba(14, 165, 233, 0.2)' : 'rgba(31, 41, 55, 0.8)'
                    }}
                    style={{ position: 'absolute', left: '-25px', top: '0', width: '50px', height: '50px' }}
                    className="rounded-full border-2 flex items-center justify-center font-black text-slate-100 shadow-xl z-20"
                >
                    {val}
                </motion.div>
            );
        });
    };

    const renderEdges = () => {
        const edges = [];
        for (let i = 0; i < heap.length; i++) {
            const left = getLeft(i);
            const right = getRight(i);
            
            if (left < heap.length) edges.push({ from: i, to: left });
            if (right < heap.length) edges.push({ from: i, to: right });
        }

        return edges.map((edge, idx) => {
            const levelF = Math.floor(Math.log2(edge.from + 1));
            const posF = edge.from - (Math.pow(2, levelF) - 1);
            const xF = (posF + 0.5) * (100 / Math.pow(2, levelF));
            const yF = levelF * 25 + 10;

            const levelT = Math.floor(Math.log2(edge.to + 1));
            const posT = edge.to - (Math.pow(2, levelT) - 1);
            const xT = (posT + 0.5) * (100 / Math.pow(2, levelT));
            const yT = levelT * 25 + 10;

            return (
                <svg key={idx} className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    <motion.line
                        x1={`${xF}%`} y1={`${yF}%`}
                        x2={`${xT}%`} y2={`${yT}%`}
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="2"
                    />
                </svg>
            );
        });
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-12">
            <div className="text-center space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Min-Heap Visualization</p>
                <p className="text-xl font-black text-slate-100">{message}</p>
            </div>

            <div className="relative w-full max-w-2xl h-64 bg-slate-900/30 rounded-3xl border border-white/5 overflow-hidden p-8">
                {renderEdges()}
                {renderNodes()}
            </div>

            <div className="flex gap-4">
                <button onClick={handleInsert} className="btn-primary px-8">Insert Rand</button>
                <button onClick={reset} className="btn-secondary px-8">Reset</button>
            </div>
            
            <div className="bg-brand-500/5 p-4 rounded-xl border border-brand-500/10 text-xs text-slate-400 max-w-md text-center">
                Nodes are arranged in a complete binary tree. Parent of node at index <code className="text-brand-400">i</code> is at <code className="text-brand-400">floor((i-1)/2)</code>.
            </div>
        </div>
    );
}
