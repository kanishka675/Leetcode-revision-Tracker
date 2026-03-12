import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PrefixSumVisualizer() {
    const [nums] = useState([2, 1, 3, 4, 5]);
    const [prefix, setPrefix] = useState(new Array(nums.length).fill(null));
    const [idx, setIdx] = useState(-1);
    const [status, setStatus] = useState('Wait'); // Wait, Building, Done, Query
    const [query, setQuery] = useState({ L: 1, R: 3 }); // Range [1, 3] sum = nums[1]+nums[2]+nums[3] = 1+3+4 = 8

    const handleNext = () => {
        if (status === 'Wait') {
            setStatus('Building');
            setIdx(0);
            const newPrefix = [nums[0]];
            setPrefix(prev => {
                const arr = [...prev];
                arr[0] = nums[0];
                return arr;
            });
            return;
        }

        if (status === 'Building') {
            if (idx < nums.length - 1) {
                const nextIdx = idx + 1;
                setIdx(nextIdx);
                setPrefix(prev => {
                    const arr = [...prev];
                    arr[nextIdx] = arr[idx] + nums[nextIdx];
                    return arr;
                });
            } else {
                setStatus('Query');
            }
        } else if (status === 'Query') {
            setStatus('Done');
        }
    };

    const reset = () => {
        setPrefix(new Array(nums.length).fill(null));
        setIdx(-1);
        setStatus('Wait');
    };

    const rangeSum = query.R >= 0 ? (prefix[query.R] - (query.L > 0 ? prefix[query.L - 1] : 0)) : null;

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-10 w-full">
            <div className="text-center space-y-2">
                <p className="text-[10px] font-black text-brand-500 uppercase tracking-[0.2em]">Pattern: Prefix Sum</p>
                <h2 className="text-2xl font-black text-slate-100">
                    {status === 'Wait' && 'Compute cumulative sums for O(1) range queries'}
                    {status === 'Building' && `prefix[${idx}] = prefix[${idx-1}] + nums[${idx}]`}
                    {status === 'Query' && `Range Sum [${query.L}, ${query.R}] = prefix[${query.R}] - prefix[${query.L-1}]`}
                    {status === 'Done' && `Result: ${prefix[query.R]} - ${prefix[query.L-1]} = ${rangeSum}`}
                </h2>
            </div>

            <div className="w-full max-w-2xl space-y-8">
                {/* Original Array */}
                <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest text-center">Original Array (nums)</p>
                    <div className="flex justify-center gap-3">
                        {nums.map((val, i) => {
                            const inQuery = status !== 'Wait' && status !== 'Building' && i >= query.L && i <= query.R;
                            return (
                                <motion.div
                                    key={`nums-${i}`}
                                    animate={{
                                        borderColor: inQuery ? '#10b981' : (i === idx) ? '#0ea5e9' : 'rgba(255,255,255,0.05)',
                                        backgroundColor: inQuery ? 'rgba(16, 185, 129, 0.1)' : (i === idx) ? 'rgba(14, 165, 233, 0.1)' : 'rgba(255,255,255,0.02)'
                                    }}
                                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-slate-400 border-2"
                                >
                                    {val}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Prefix Sum Array */}
                <div className="space-y-3">
                    <p className="text-[10px] font-bold text-brand-500 uppercase tracking-widest text-center">Prefix Sum Array (prefix)</p>
                    <div className="flex justify-center gap-3">
                        {prefix.map((val, i) => {
                            const isSelected = (status === 'Query' || status === 'Done') && (i === query.R || i === query.L - 1);
                            return (
                                <motion.div
                                    key={`prefix-${i}`}
                                    animate={{
                                        scale: isSelected ? 1.1 : 1,
                                        borderColor: isSelected ? '#a855f7' : (i === idx) ? '#0ea5e9' : 'rgba(255,255,255,0.1)',
                                        opacity: val === null ? 0.3 : 1
                                    }}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-black border-2 transition-all ${
                                        val === null ? 'bg-transparent border-dashed' : isSelected ? 'bg-purple-500/20 text-purple-400' : 'bg-brand-500/10 text-brand-400'
                                    }`}
                                >
                                    {val ?? '?'}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
                <button 
                    onClick={handleNext} 
                    disabled={status === 'Done'}
                    className="btn-primary px-8 shadow-brand-600/20"
                >
                    {status === 'Wait' ? 'Start Building' : status === 'Building' ? 'Next Step' : status === 'Query' ? 'Show Result' : 'Done'}
                </button>
                <button onClick={reset} className="btn-secondary px-8">Reset</button>
            </div>
        </div>
    );
}
