import { useState } from 'react';
import { motion } from 'framer-motion';

export default function UnionFindVisualizer() {
    const [nodes] = useState([0, 1, 2, 3, 4, 5]);
    const [parent, setParent] = useState([0, 1, 2, 3, 4, 5]);
    const [rank, setRank] = useState([0, 0, 0, 0, 0, 0]);
    const [status, setStatus] = useState('Wait');
    const [message, setMessage] = useState('Nodes are independent sets');
    const [activeUnion, setActiveUnion] = useState([-1, -1]);

    const find = (i, p) => {
        if (p[i] === i) return i;
        return find(p[i], p); // Simple find for demo
    };

    const handleUnion = (u, v) => {
        setActiveUnion([u, v]);
        const rootU = find(u, parent);
        const rootV = find(v, parent);

        if (rootU !== rootV) {
            const nextParent = [...parent];
            if (rank[rootU] < rank[rootV]) {
                nextParent[rootU] = rootV;
            } else if (rank[rootU] > rank[rootV]) {
                nextParent[rootV] = rootU;
            } else {
                nextParent[rootV] = rootU;
                const nextRank = [...rank];
                nextRank[rootU]++;
                setRank(nextRank);
            }
            setParent(nextParent);
            setMessage(`United ${u} and ${v} (Roots: ${rootU}, ${rootV})`);
        } else {
            setMessage(`${u} and ${v} are already in the same set`);
        }
    };

    const reset = () => {
        setParent([0, 1, 2, 3, 4, 5]);
        setRank([0, 0, 0, 0, 0, 0]);
        setStatus('Wait');
        setMessage('Nodes are independent sets');
        setActiveUnion([-1, -1]);
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-12">
            <div className="text-center space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Union Find / Disjoint Set</p>
                <p className="text-xl font-black text-slate-100">{message}</p>
            </div>

            <div className="flex gap-8 flex-wrap justify-center">
                {nodes.map((node) => {
                    const root = find(node, parent);
                    const isActive = activeUnion.includes(node);
                    
                    return (
                        <div key={node} className="flex flex-col items-center gap-2">
                            <motion.div
                                animate={{
                                    scale: isActive ? 1.1 : 1,
                                    borderColor: isActive ? 'var(--viz-highlight-active)' : 'var(--viz-border-inactive)',
                                    backgroundColor: `hsla(${root * 60}, 70%, 50%, 0.2)`
                                }}
                                className="w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center shadow-lg"
                            >
                                <span className="text-lg font-black text-slate-100">{node}</span>
                                <span className="text-[10px] text-slate-500">P: {parent[node]}</span>
                            </motion.div>
                            <span className="text-[10px] font-bold text-slate-600 uppercase">Set {root}</span>
                        </div>
                    );
                })}
            </div>

            <div className="flex gap-4">
                <button onClick={() => handleUnion(0, 1)} className="btn-secondary text-xs px-4">Union(0,1)</button>
                <button onClick={() => handleUnion(2, 3)} className="btn-secondary text-xs px-4">Union(2,3)</button>
                <button onClick={() => handleUnion(1, 2)} className="btn-secondary text-xs px-4">Union(1,2)</button>
                <button onClick={() => handleUnion(4, 5)} className="btn-secondary text-xs px-4">Union(4,5)</button>
                <button onClick={reset} className="btn-primary text-xs px-8">Reset</button>
            </div>

            <div className="text-xs text-slate-500 italic text-center max-w-md">
                Union by Rank and Find operations. Colors represent different disjoint sets. Direct parent pointer shown as 'P'.
            </div>
        </div>
    );
}
