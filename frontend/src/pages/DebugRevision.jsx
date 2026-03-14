import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

export default function DebugRevision() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const [userCode, setUserCode] = useState('');
    const [showSolution, setShowSolution] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [isSolved, setIsSolved] = useState(false);

    useEffect(() => {
        const fetchDebugSession = async () => {
            try {
                const { data } = await api.post(`/api/revision/debug/${id}`);
                setSession(data);
                setUserCode(data.buggyCode);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to start debug session');
                navigate('/review');
            } finally {
                setLoading(false);
            }
        };
        fetchDebugSession();
    }, [id, navigate]);

    const handleSubmit = async () => {
        setVerifying(true);
        try {
            const { data } = await api.post(`/api/revision/verify/${id}`, { fixedCode: userCode });
            if (data.success) {
                setIsSolved(true);
                toast.success('Bug Fixed! Great job! 🎉', { duration: 4000 });
            } else {
                toast.error(data.message, { icon: '🤔' });
            }
        } catch (error) {
            toast.error('Verification failed');
        } finally {
            setVerifying(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-brand-600/30 border-t-brand-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate('/review')}
                    className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1.5 text-sm font-medium"
                >
                    ✕ Cancel Debug
                </button>
                <div className="text-right">
                    <span className="text-brand-400 text-sm font-bold tracking-wider uppercase">
                        Debug Mode 🐞
                    </span>
                </div>
            </div>

            <div className="card mb-6 border-brand-500/10 shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-white/5">
                    <h2 className="text-xl font-bold text-slate-100 mb-1">{session?.problemTitle}</h2>
                    <p className="text-sm text-slate-400 italic">"Fix the logical error in the code below to match the original solution."</p>
                </div>

                <div className="h-[450px] relative">
                    <Editor
                        height="100%"
                        defaultLanguage="javascript"
                        theme="vs-dark"
                        value={userCode}
                        onChange={(val) => setUserCode(val)}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            padding: { top: 16 }
                        }}
                    />
                    
                    <AnimatePresence>
                        {isSolved && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 bg-emerald-900/90 backdrop-blur-md z-10 flex flex-col items-center justify-center p-8 text-center"
                            >
                                <div className="text-6xl mb-4">✅</div>
                                <h3 className="text-2xl font-bold text-white mb-2">Algorithm Mastered!</h3>
                                <p className="text-emerald-100/70 mb-8 max-w-sm">
                                    You successfully identified and fixed the bug. Your revision stats have been updated.
                                </p>
                                <button 
                                    onClick={() => navigate('/review')}
                                    className="btn-primary bg-emerald-600 hover:bg-emerald-500 border-none px-8"
                                >
                                    Back to Revision Queue →
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="p-4 bg-slate-900/50 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-white/5">
                    <div className="flex gap-2 items-center bg-orange-500/10 px-4 py-2 rounded-lg border border-orange-500/20">
                        <span className="text-lg">💡</span>
                        <div className="text-xs">
                            <p className="font-bold text-orange-400 uppercase tracking-widest">Hint</p>
                            <p className="text-slate-300">{session?.hint}</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button 
                            onClick={() => setShowSolution(!showSolution)}
                            className="btn-secondary whitespace-nowrap px-6"
                        >
                            {showSolution ? 'Hide Solution' : 'Reveal Solution'}
                        </button>
                        <button 
                            onClick={handleSubmit}
                            disabled={verifying || isSolved}
                            className="btn-primary whitespace-nowrap px-10 shadow-brand-600/20"
                        >
                            {verifying ? 'Checking...' : 'Submit Fix'}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showSolution && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="card border-brand-500/20 bg-brand-500/5 backdrop-blur-sm"
                    >
                        <h4 className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-4">Original Reference Solution</h4>
                        <div className="bg-slate-900/80 rounded-lg p-4 font-mono text-sm overflow-auto max-h-[300px] text-slate-300 whitespace-pre">
                            {session?.originalCode}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
