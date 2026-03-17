import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';
import RecallInsights from '../components/RecallInsights';

export default function RecallPage() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            const { data } = await api.get('/revision/recall');
            setProblems(data);
        } catch (error) {
            toast.error('Failed to fetch problems for recall');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-brand-600/20 border-t-brand-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
            <header className="space-y-2">
                <h1 className="text-4xl font-black text-slate-100 tracking-tight">Algorithm <span className="text-brand-500">Recall</span></h1>
                <p className="text-slate-400 text-lg max-w-2xl">
                    Test your memory of algorithm patterns, data structures, and optimal time complexities for problems you've solved.
                </p>
            </header>

            <RecallInsights />

            {problems.length === 0 ? (
                <div className="text-center py-20 card glass border-dashed">
                    <p className="text-slate-500 italic">No problems found. Start adding and solving problems to build your recall deck!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {problems.map((problem) => (
                            <motion.div
                                key={problem._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="card glass flex flex-col justify-between group hover:border-brand-500/30 transition-all duration-300"
                            >
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                                            problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                            problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                            'bg-red-500/10 text-red-500 border border-red-500/20'
                                        }`}>
                                            {problem.difficulty}
                                        </span>
                                        <div className="flex gap-1">
                                            {problem.topics?.slice(0, 2).map((topic, i) => (
                                                <span key={i} className="text-[10px] font-bold text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-100 group-hover:text-brand-400 transition-colors uppercase tracking-tight line-clamp-1">
                                        {problem.title}
                                    </h3>
                                    <p className="text-sm text-slate-400 line-clamp-2 italic">
                                        {problem.notes || "No notes added for this problem."}
                                    </p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/5">
                                    <Link 
                                        to={`/recall/${problem._id}`}
                                        className="w-full btn-primary flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-transform"
                                    >
                                        🧠 Start Recall
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
            )}
        </div>
    );
}
