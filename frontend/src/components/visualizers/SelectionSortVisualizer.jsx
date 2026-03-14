import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizerControls from './VisualizerControls';

export default function SelectionSortVisualizer() {
    const defaultArray = [64, 25, 12, 22, 11, 34, 90];
    const [array, setArray] = useState([...defaultArray]);
    const [status, setStatus] = useState('Wait');
            const [message, setMessage] = useState('Find the minimum element and swap it with the first unsorted element.');
    
    // Selection Sort State
    const [i, setI] = useState(0); // Sorted boundary
    const [j, setJ] = useState(0); // Current scanning
    const [minIdx, setMinIdx] = useState(0);
    const [swapping, setSwapping] = useState(false);

    const handleNext = () => {
        if (status === 'Over') return;

        if (status === 'Wait') {
            setStatus('Running');
            setI(0);
            setJ(1);
            setMinIdx(0);
            setMessage(`Starting at index 0 (val: ${array[0]}). Searching for minimum...`);
            setSwapping(false);
            return;
        }

        const n = array.length;
        if (i >= n - 1) {
            setStatus('Over');
                        setJ(-1);
            setMinIdx(-1);
            setMessage('Array is sorted!');
            return;
        }

        let newArray = [...array];
        let nextI = i;
        let nextJ = j;
        let nextMinIdx = minIdx;
        let nextSwapping = false;

        // If we just finished swapping, move boundary
        if (swapping) {
            nextI = i + 1;
            if (nextI >= n - 1) {
                setStatus('Over');
                                setJ(-1);
                setMinIdx(-1);
                setMessage('Array is sorted!');
                setI(nextI);
                setSwapping(false);
                return;
            }
            nextJ = nextI + 1;
            nextMinIdx = nextI;
            setMessage(`Moved boundary. New min candidate is ${newArray[nextI]} at idx ${nextI}`);
        } 
        // If we are scanning for minimum
        else if (j < n) {
            if (newArray[j] < newArray[minIdx]) {
                nextMinIdx = j;
                setMessage(`Found new minimum: ${newArray[j]} at idx ${j}`);
            } else {
                setMessage(`Scanning idx ${j} (${newArray[j]}), min is still ${newArray[minIdx]}`);
            }
            nextJ = j + 1;
            
            // Reached end of scanning
            if (nextJ >= n) {
                if (nextMinIdx !== i) {
                    setMessage(`End of array. Swapping ${newArray[i]} (idx ${i}) with min ${newArray[nextMinIdx]}`);
                    // Perform Swap
                    let temp = newArray[i];
                    newArray[i] = newArray[nextMinIdx];
                    newArray[nextMinIdx] = temp;
                    nextSwapping = true;
                } else {
                    setMessage(`Minimum is already at the correct position (idx ${i}). No swap needed.`);
                    nextSwapping = true; // Act as if swapped to trigger boundary move
                }
            }
        }

        setArray(newArray);
        setI(nextI);
        setJ(nextJ);
        setMinIdx(nextMinIdx);
        setSwapping(nextSwapping);
    };

    
    const reset = () => {
        setArray([...defaultArray]);
        setI(0);
        setJ(0);
        setMinIdx(0);
        setSwapping(false);
        setStatus('Wait');
                setMessage('Find the minimum element and swap it with the first unsorted element.');
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="text-center space-y-2 mb-12">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Selection Sort</p>
                <p className="text-lg font-bold text-slate-300 max-w-lg mx-auto min-h-[3rem]">{message}</p>
            </div>

            <div className="flex items-end justify-center min-h-[250px] gap-2">
                {array.map((val, idx) => {
                    const isSorted = status === 'Over' || (status === 'Running' && idx < i);
                    const isMin = idx === minIdx && !swapping;
                    const isScanning = idx === j && !swapping;
                    const isSwapping = swapping && (idx === i || idx === minIdx);
                    
                    return (
                        <div key={idx} className="flex flex-col items-center gap-2">
                            <motion.div
                                layout
                                animate={{
                                    height: `${(val / 100) * 200}px`,
                                    backgroundColor: isSorted ? 'rgba(16, 185, 129, 0.5)' : 
                                                     isSwapping ? 'rgba(234, 179, 8, 0.8)' : 
                                                     isMin ? 'rgba(239, 68, 68, 0.8)' : 
                                                     isScanning ? 'rgba(168, 85, 247, 0.6)' : 'rgba(14, 165, 233, 0.4)',
                                    borderColor: isSorted ? '#10b981' : isSwapping ? '#eab308' : isMin ? '#ef4444' : isScanning ? '#a855f7' : '#0ea5e9'
                                }}
                                className="w-10 rounded-t-lg border-2 border-b-0"
                            />
                            <motion.div 
                                layout
                                className={`w-10 h-10 rounded-xl border flex items-center justify-center font-black ${
                                    isSorted ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 
                                    isSwapping ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' :
                                    isMin ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 
                                    isScanning ? 'bg-purple-500/20 border-purple-500 text-purple-400' :
                                    'bg-slate-800 border-slate-600 text-slate-300'
                                }`}
                            >
                                {val}
                            </motion.div>
                        </div>
                    );
                })}
            </div>

            <VisualizerControls 
                onNext={handleNext}
                onReset={reset}
                status={status}
            />
        </div>
    );
}
