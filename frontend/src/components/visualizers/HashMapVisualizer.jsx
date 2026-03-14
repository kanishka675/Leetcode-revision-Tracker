import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizerControls from './VisualizerControls';

export default function HashMapVisualizer() {
    const [array] = useState([2, 7, 11, 15]);
    const target = 9;
    const [map, setMap] = useState({});
    const [index, setIndex] = useState(-1);
    const [status, setStatus] = useState('Wait'); // Wait, Running, Over
            const [message, setMessage] = useState('Find two numbers that add up to 9.');
    const [foundIndices, setFoundIndices] = useState(null);

    const handleNext = () => {
        if (status === 'Over') return;
        
        if (status === 'Wait') {
            setStatus('Running');
            setIndex(0);
            setMessage(`Target is ${target}. Checking element 0: ${array[0]}`);
            return;
        }

        const currIndex = index;
        const currentVal = array[currIndex];
        const complement = target - currentVal;

        if (map[complement] !== undefined) {
            setFoundIndices([map[complement], currIndex]);
            setMessage(`Found complement ${complement} at index ${map[complement]}! Result: [${map[complement]}, ${currIndex}]`);
            setStatus('Over');
                        return;
        }

        // Not found, add to map
        if (currIndex < array.length - 1) {
            setMap(prev => ({ ...prev, [currentVal]: currIndex }));
            setIndex(currIndex + 1);
            setMessage(`Complement ${complement} not found. Added ${currentVal} (val) -> ${currIndex} (idx) to map. Moving to next.`);
        } else {
            setMap(prev => ({ ...prev, [currentVal]: currIndex }));
            setMessage('No solution found in the array.');
            setStatus('Over');
                    }
    };

    
    const reset = () => {
        setIndex(-1);
        setMap({});
        setStatus('Wait');
                setFoundIndices(null);
        setMessage('Find two numbers that add up to 9.');
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="text-center space-y-2 mb-12">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Hash Map (Two Sum)</p>
                <p className="text-lg font-bold text-slate-300 max-w-lg mx-auto min-h-[3rem]">{message}</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-16 items-start justify-center w-full max-w-4xl">
                {/* Array */}
                <div className="flex flex-col items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Input Array</span>
                    <div className="flex gap-2">
                        {array.map((val, i) => {
                            const isCurrent = i === index;
                            const isFound = foundIndices?.includes(i);
                            return (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <motion.div
                                        animate={{
                                            scale: isCurrent || isFound ? 1.1 : 1,
                                            borderColor: isFound ? '#10b981' : isCurrent ? '#0ea5e9' : 'rgba(255,255,255,0.1)',
                                            backgroundColor: isFound ? 'rgba(16, 185, 129, 0.2)' : isCurrent ? 'rgba(14, 165, 233, 0.2)' : 'rgba(31, 41, 55, 0.5)'
                                        }}
                                        className="w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center shadow-lg"
                                    >
                                        <span className="text-lg font-black text-slate-200">{val}</span>
                                    </motion.div>
                                    <span className="text-[10px] font-bold text-slate-500">Idx: {i}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Hash Map View */}
                <div className="flex flex-col items-center gap-4 min-w-[200px]">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Hash Map (Value → Index)</span>
                    <div className="w-full bg-slate-800/30 rounded-2xl border border-white/5 p-4 flex flex-col gap-2 min-h-[150px]">
                        <AnimatePresence>
                            {Object.entries(map).length === 0 && (
                                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-xs text-slate-500 italic text-center py-8">
                                    Map is empty
                                </motion.div>
                            )}
                            {Object.entries(map).map(([key, val]) => (
                                <motion.div
                                    key={key}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex justify-between items-center px-4 py-2 rounded-xl text-sm font-bold border ${
                                        (foundIndices && foundIndices.includes(val)) 
                                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                                        : 'bg-slate-900/50 border-white/5 text-slate-300'
                                    }`}
                                >
                                    <span>Val: {key}</span>
                                    <span className="text-brand-400">Idx: {val}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
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
