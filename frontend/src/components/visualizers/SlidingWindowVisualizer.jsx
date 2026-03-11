import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SlidingWindowVisualizer() {
    const array = [2, 1, 5, 1, 3, 2];
    const k = 3; // Fixed size for demo
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(0);
    const [maxSum, setMaxSum] = useState(0);
    const [currentSum, setCurrentSum] = useState(0);
    const [status, setStatus] = useState('Wait'); // Wait, Expanding, Sliding, Over

    const handleNext = () => {
        if (status === 'Wait') {
            setStatus('Expanding');
            setCurrentSum(array[0]);
            return;
        }

        if (status === 'Expanding') {
            if (end < k - 1) {
                const newEnd = end + 1;
                setEnd(newEnd);
                setCurrentSum(prev => prev + array[newEnd]);
            } else {
                setStatus('Sliding');
                setMaxSum(currentSum);
            }
            return;
        }

        if (status === 'Sliding') {
            if (end < array.length - 1) {
                const nextVal = array[end + 1];
                const prevVal = array[start];
                const newSum = currentSum - prevVal + nextVal;
                
                setStart(prev => prev + 1);
                setEnd(prev => prev + 1);
                setCurrentSum(newSum);
                if (newSum > maxSum) setMaxSum(newSum);
            } else {
                setStatus('Over');
            }
        }
    };

    const reset = () => {
        setStart(0);
        setEnd(0);
        setCurrentSum(0);
        setMaxSum(0);
        setStatus('Wait');
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-12">
            <div className="text-center space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Find Max Sum of Size {k}</p>
                <div className="flex gap-8 justify-center">
                    <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Current Sum</p>
                        <p className="text-2xl font-black text-brand-400">{currentSum}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Max Found</p>
                        <p className="text-2xl font-black text-emerald-400">{maxSum}</p>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 h-20 items-center">
                {array.map((val, i) => {
                    const inWindow = i >= start && i <= end && status !== 'Wait';
                    return (
                        <motion.div
                            key={i}
                            animate={{
                                backgroundColor: inWindow ? 'rgba(14, 165, 233, 0.2)' : 'rgba(30, 41, 59, 0.5)',
                                borderColor: inWindow ? '#0ea5e9' : 'rgba(255,255,255,0.05)',
                                scale: inWindow ? 1.05 : 1
                            }}
                            className={`w-12 h-12 rounded-xl border flex items-center justify-center font-bold text-lg transition-colors ${
                                inWindow ? 'text-brand-400' : 'text-slate-600'
                            }`}
                        >
                            {val}
                        </motion.div>
                    );
                })}
            </div>

            <div className="flex gap-4">
                <button 
                    onClick={handleNext} 
                    disabled={status === 'Over'}
                    className="btn-primary px-8 shadow-brand-600/20"
                >
                    {status === 'Wait' ? 'Start' : 'Next Step'}
                </button>
                <button onClick={reset} className="btn-secondary px-8">Reset</button>
            </div>
        </div>
    );
}
