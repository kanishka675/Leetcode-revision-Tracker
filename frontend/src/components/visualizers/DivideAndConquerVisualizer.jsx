import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DivideAndConquerVisualizer() {
    // Merge Sort Visualization
    const [array] = useState([38, 27, 43, 3, 9, 82, 10]);
    const [steps, setSteps] = useState([]); // Array of states representing stages of split/merge
    const [currentStep, setCurrentStep] = useState(-1);

    // Simplified steps for visualization:
    // Split 1: [38, 27, 43] [3, 9, 82, 10]
    // Split 2: [38] [27, 43] | [3, 9] [82, 10]
    // ... then merge back
    const visualizationSteps = [
        { label: 'Initial Array', groups: [[38, 27, 43, 3, 9, 82, 10]], action: 'Ready' },
        { label: 'Divide', groups: [[38, 27, 43], [3, 9, 82, 10]], action: 'Split' },
        { label: 'Divide further', groups: [[38], [27, 43], [3, 9], [82, 10]], action: 'Split' },
        { label: 'Base Case reached', groups: [[38], [27], [43], [3], [9], [82], [10]], action: 'Split' },
        { label: 'Sort & Merge', groups: [[38], [27, 43], [3, 9], [10, 82]], action: 'Merge' },
        { label: 'Sort & Merge', groups: [[27, 38, 43], [3, 9, 10, 82]], action: 'Merge' },
        { label: 'Final Sorted Array', groups: [[3, 9, 10, 27, 38, 43, 82]], action: 'Done' }
    ];

    const handleNext = () => {
        if (currentStep < visualizationSteps.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const reset = () => {
        setCurrentStep(-1);
    };

    const activeStep = currentStep === -1 ? visualizationSteps[0] : visualizationSteps[currentStep];

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-12">
            <div className="text-center space-y-2">
                <p className="text-[10px] font-black text-brand-500 uppercase tracking-[0.2em]">Pattern: Divide & Conquer</p>
                <h2 className="text-2xl font-black text-slate-100">
                    {currentStep === -1 ? 'Merge Sort: Split until single elements, then merge sorted' : activeStep.label}
                </h2>
            </div>

            <div className="flex flex-col items-center gap-8 w-full">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={currentStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-wrap justify-center gap-8 md:gap-16 w-full"
                    >
                        {activeStep.groups.map((group, gIdx) => (
                            <div key={gIdx} className="flex gap-2 p-3 bg-slate-800/20 rounded-xl border border-white/5 shadow-xl">
                                {group.map((val, vIdx) => (
                                    <motion.div
                                        key={`${gIdx}-${vIdx}-${val}`}
                                        layout
                                        className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center font-bold text-sm md:text-base border transition-colors shadow-lg ${
                                            activeStep.action === 'Merge' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' :
                                            activeStep.action === 'Split' ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400' :
                                            'bg-brand-500/10 border-brand-500/40 text-brand-400'
                                        }`}
                                    >
                                        {val}
                                    </motion.div>
                                ))}
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
                <button 
                    onClick={handleNext} 
                    disabled={currentStep === visualizationSteps.length - 1}
                    className="btn-primary px-8 shadow-brand-600/20"
                >
                    {currentStep === -1 ? 'Start' : 'Next Step'}
                </button>
                <button onClick={reset} className="btn-secondary px-8">Reset</button>
            </div>

            <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-600">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" /> Divide
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" /> Conquer (Merge)
                 </div>
            </div>
        </div>
    );
}
