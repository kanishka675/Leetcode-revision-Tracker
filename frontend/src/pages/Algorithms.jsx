import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axiosInstance';
import TwoPointerVisualizer from '../components/visualizers/TwoPointerVisualizer';
import SlidingWindowVisualizer from '../components/visualizers/SlidingWindowVisualizer';
import BinarySearchVisualizer from '../components/visualizers/BinarySearchVisualizer';
import GraphVisualizer from '../components/visualizers/GraphVisualizer';
import FastSlowPointerVisualizer from '../components/visualizers/FastSlowPointerVisualizer';
import CyclicSortVisualizer from '../components/visualizers/CyclicSortVisualizer';
import DivideAndConquerVisualizer from '../components/visualizers/DivideAndConquerVisualizer';
import PrefixSumVisualizer from '../components/visualizers/PrefixSumVisualizer';

export default function AlgorithmsPage() {
    const [algorithms, setAlgorithms] = useState([]);
    const [selectedAlg, setSelectedAlg] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/api/algorithms')
            .then(({ data }) => {
                setAlgorithms(data);
                if (data.length > 0) setSelectedAlg(data[0]);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const renderVisualizer = () => {
        if (!selectedAlg) return null;
        switch (selectedAlg.name) {
            case 'two-pointer': return <TwoPointerVisualizer />;
            case 'sliding-window': return <SlidingWindowVisualizer />;
            case 'binary-search': return <BinarySearchVisualizer />;
            case 'bfs': return <GraphVisualizer type="bfs" />;
            case 'dfs': return <GraphVisualizer type="dfs" />;
            case 'fast-slow-pointers': return <FastSlowPointerVisualizer />;
            case 'cyclic-sort': return <CyclicSortVisualizer />;
            case 'divide-conquer': return <DivideAndConquerVisualizer />;
            case 'prefix-sum': return <PrefixSumVisualizer />;
            default: return <div className="p-12 text-center text-slate-500 italic">Visualizer for {selectedAlg.title} coming soon...</div>;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-brand-600/20 border-t-brand-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-4rem)] flex flex-col sm:flex-row gap-8 overflow-hidden">
            {/* Sidebar */}
            <div className="w-full sm:w-64 flex-shrink-0 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
                <h2 className="text-2xl font-black text-slate-100 uppercase tracking-tighter">Patterns</h2>
                <div className="space-y-2">
                    {algorithms.map((alg) => (
                        <button
                            key={alg.name}
                            onClick={() => setSelectedAlg(alg)}
                            className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all border ${
                                selectedAlg?.name === alg.name
                                    ? 'bg-brand-600/20 text-brand-400 border-brand-500/40 shadow-lg shadow-brand-600/10'
                                    : 'text-slate-500 border-transparent hover:bg-brand-500/5 hover:text-slate-300'
                            }`}
                        >
                            {alg.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
                <AnimatePresence mode="wait">
                    {selectedAlg && (
                        <motion.div
                            key={selectedAlg.name}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                <div>
                                    <h1 className="text-4xl font-black text-slate-100 tracking-tight">{selectedAlg.title}</h1>
                                    <p className="text-slate-400 mt-2 text-lg max-w-2xl">{selectedAlg.explanation}</p>
                                </div>
                                {selectedAlg.exampleProblem && (
                                    <a
                                        href={selectedAlg.exampleProblem.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn-secondary text-sm px-4 py-2 flex items-center gap-2 border-dashed"
                                    >
                                        🚀 Solve: {selectedAlg.exampleProblem.title}
                                    </a>
                                )}
                            </div>

                            {/* Visualizer Container */}
                            <div className="card glass min-h-[400px] flex flex-col border-brand-500/10 relative overflow-hidden bg-brand-500/5">
                                <div className="absolute top-0 left-0 p-4 z-10">
                                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-500 opacity-50">Interactive Sandbox</span>
                                </div>
                                {renderVisualizer()}
                            </div>

                            {/* Steps / Description */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {selectedAlg.steps.map((step, i) => (
                                    <div key={i} className="p-4 bg-brand-500/5 rounded-xl border border-brand-500/10">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center text-[10px] font-black">{i + 1}</span>
                                            <h3 className="font-bold text-slate-200">{step.label}</h3>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
