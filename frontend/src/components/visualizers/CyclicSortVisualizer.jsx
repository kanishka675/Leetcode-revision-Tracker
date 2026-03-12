import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CyclicSortVisualizer() {
    const [array, setArray] = useState([3, 1, 5, 4, 2]);
    const [i, setI] = useState(0);
    const [status, setStatus] = useState('Wait'); // Wait, Sorting, Swapping, Done
    const [swapIndices, setSwapIndices] = useState([]);

    const handleNext = () => {
        if (status === 'Wait') {
            setStatus('Sorting');
            return;
        }

        if (i >= array.length) {
            setStatus('Done');
            return;
        }

        const correctIdx = array[i] - 1;

        if (array[i] !== array[correctIdx]) {
            // Need to swap
            setSwapIndices([i, correctIdx]);
            setStatus('Swapping');
            
            // Execute swap
            setTimeout(() => {
                const newArr = [...array];
                [newArr[i], newArr[correctIdx]] = [newArr[correctIdx], newArr[i]];
                setArray(newArr);
                setSwapIndices([]);
                setStatus('Sorting');
            }, 800);
        } else {
            // Already correct, move to next
            setI(prev => prev + 1);
            if (i + 1 >= array.length) setStatus('Done');
        }
    };

    const reset = () => {
        setArray([3, 1, 5, 4, 2]);
        setI(0);
        setStatus('Wait');
        setSwapIndices([]);
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-12">
            <div className="text-center space-y-2">
                <p className="text-[10px] font-black text-brand-500 uppercase tracking-[0.2em]">Pattern: Cyclic Sort</p>
                <h2 className="text-2xl font-black text-slate-100">
                    {status === 'Wait' && 'Sort numbers 1-N in O(N)'}
                    {status === 'Sorting' && (i < array.length ? `Checking if ${array[i]} is at index ${array[i]-1}` : 'Array is sorted!')}
                    {status === 'Swapping' && `Swapping ${array[swapIndices[0]]} and ${array[swapIndices[1]]}`}
                    {status === 'Done' && '🎉 All numbers in correct positions!'}
                </h2>
            </div>

            {/* Array Visualization */}
            <div className="flex gap-4">
                {array.map((val, idx) => {
                    const isCurrent = idx === i;
                    const isSwapping = swapIndices.includes(idx);
                    const isCorrect = val === idx + 1;

                    return (
                        <div key={idx} className="flex flex-col items-center gap-3">
                            <motion.div
                                layout
                                initial={false}
                                animate={{
                                    scale: isSwapping ? 1.2 : isCurrent ? 1.1 : 1,
                                    borderColor: isSwapping ? '#ef4444' : isCorrect ? '#10b981' : isCurrent ? '#0ea5e9' : 'rgba(255,255,255,0.1)',
                                    backgroundColor: isSwapping ? 'rgba(239, 68, 68, 0.1)' : isCurrent ? 'rgba(14, 165, 233, 0.1)' : 'rgba(255,255,255,0.02)'
                                }}
                                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black border-2 transition-colors duration-300 ${
                                    isCorrect ? 'text-emerald-500' : isCurrent ? 'text-brand-400' : 'text-slate-600'
                                }`}
                            >
                                {val}
                            </motion.div>
                            <span className="text-[10px] font-bold text-slate-600">IDX {idx}</span>
                        </div>
                    );
                })}
            </div>

            {/* Controls */}
            <div className="flex gap-4">
                <button 
                    onClick={handleNext} 
                    disabled={status === 'Swapping' || status === 'Done'}
                    className="btn-primary px-8 shadow-brand-600/20"
                >
                    {status === 'Wait' ? 'Start Sorting' : 'Next Step'}
                </button>
                <button onClick={reset} className="btn-secondary px-8">Reset</button>
            </div>

            <div className="text-xs text-slate-500 flex gap-8">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-brand-500/20 border border-brand-500" /> Current Pointer</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500" /> Correct Position</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500" /> Swapping</div>
            </div>
        </div>
    );
}
