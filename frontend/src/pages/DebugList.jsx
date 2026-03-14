import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

export default function DebugList() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                // Fetch all problems (logic can be refined to show only solved/debuggable ones)
                const { data } = await api.get('/api/problems');
                // Filter to ensure we only show problems with enough code to debug
                const debuggable = data.filter(p => 
                    (p.optimizedSolution || p.optimizedApproach || p.approach || "").length >= 10
                );
                setProblems(debuggable);
            } catch (error) {
                toast.error('Failed to load problems');
            } finally {
                setLoading(false);
            }
        };
        fetchProblems();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-brand-600/30 border-t-brand-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-black text-slate-100 mb-2">Debug Library 🐞</h1>
                <p className="text-slate-400">Master your algorithms by identifying and fixing logical bugs.</p>
            </div>

            {problems.length === 0 ? (
                <div className="text-center py-20 card border-dashed border-white/10">
                    <p className="text-slate-500 italic">No problems found with enough solution code to debug yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {problems.map((problem) => (
                        <div key={problem._id} className="card group hover:border-orange-500/30 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <span className={
                                    problem.difficulty === 'Easy' ? 'badge-easy' :
                                    problem.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard'
                                }>
                                    {problem.difficulty}
                                </span>
                                {problem.debugSolved && (
                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">
                                        Fixed ✅
                                    </span>
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-slate-100 mb-4 truncate group-hover:text-orange-400 transition-colors">
                                {problem.title}
                            </h3>
                            <button
                                onClick={() => navigate(`/debug/${problem._id}`)}
                                className="w-full py-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 font-bold text-sm transition-all active:scale-95"
                            >
                                Start Debug Session
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
