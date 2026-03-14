import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BitManipulationVisualizer() {
    const [num1, setNum1] = useState(5);  // 0101
    const [num2, setNum2] = useState(3);  // 0011
    const [operation, setOperation] = useState('XOR');
    const [result, setResult] = useState(6); // 0110
    const [status, setStatus] = useState('Wait');

    const toBinary = (n) => n.toString(2).padStart(4, '0').split('');

    const handleNext = () => {
        if (status === 'Wait') {
            setStatus('StepByStep');
            return;
        }
        
        // Finalize for demo
        setStatus('Over');
    };

    const runOp = (op) => {
        setOperation(op);
        let res;
        if (op === 'AND') res = num1 & num2;
        else if (op === 'OR') res = num1 | num2;
        else if (op === 'XOR') res = num1 ^ num2;
        else if (op === 'LSHIFT') res = num1 << 1;
        else if (op === 'RSHIFT') res = num1 >> 1;
        setResult(res);
        setStatus('Wait');
    };

    const reset = () => {
        setNum1(5);
        setNum2(3);
        runOp('XOR');
    };

    const renderBits = (n, label, color = 'brand') => (
        <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-black uppercase text-slate-600">{label} ({n})</span>
            <div className="flex gap-2">
                {toBinary(n).map((bit, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            backgroundColor: bit === '1' ? `var(--color-${color}-500)` : 'var(--viz-bg-inactive)',
                            borderColor: bit === '1' ? `var(--color-${color}-400)` : 'var(--viz-border-inactive)'
                        }}
                        className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-black text-white ${bit === '1' ? 'shadow-lg' : 'text-slate-600'}`}
                    >
                        {bit}
                    </motion.div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-12">
            <div className="text-center space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bitwise Operations Visualization</p>
                <div className="flex gap-4 justify-center mt-4">
                    {['XOR', 'AND', 'OR', 'LSHIFT', 'RSHIFT'].map(op => (
                        <button 
                            key={op}
                            onClick={() => runOp(op)}
                            className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${
                                operation === op ? 'bg-brand-500 text-white' : 'bg-[var(--viz-bg-inactive)] text-slate-500 hover:text-[var(--text-primary)]'
                            }`}
                        >
                            {op}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-8">
                {renderBits(num1, 'Number 1')}
                {operation !== 'LSHIFT' && operation !== 'RSHIFT' && renderBits(num2, 'Number 2')}
                
                <div className="h-px bg-[var(--viz-bg-inactive)] w-full relative">
                    <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-slate-900 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                        {operation} result
                    </div>
                </div>

                {renderBits(result, 'Result', 'indigo')}
            </div>

            <div className="flex gap-4 mt-8">
                <button onClick={() => setNum1(Math.floor(Math.random() * 15))} className="btn-secondary text-xs px-4">Random N1</button>
                <button onClick={reset} className="btn-primary text-xs px-8">Reset</button>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                :root {
                    --color-brand-500: var(--viz-highlight-active);
                    --color-brand-400: var(--viz-highlight-active);
                    --color-indigo-500: var(--viz-highlight-active);
                    --color-indigo-400: var(--viz-highlight-active);
                }
            `}} />
        </div>
    );
}
