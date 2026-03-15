import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

const TOPICS = ['Arrays', 'Strings', 'Linked List', 'Trees', 'Graphs', 'DP', 'Binary Search',
    'Sliding Window', 'Two Pointers', 'Stack', 'Queue', 'Heap', 'Trie', 'Recursion', 'Backtracking'];

const defaultForm = {
    title: '',
    leetcodeUrl: '',
    difficulty: 'Medium',
    topics: [],
    notes: '',
    timeComplexity: '',
    dataStructure: '',
    keyAlgorithmIdea: '',
    solvedDate: new Date().toISOString().split('T')[0],
};

export default function AddProblem() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const [form, setForm] = useState(defaultForm);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);

    useEffect(() => {
        if (isEdit) {
            api.get(`/api/problems/${id}`)
                .then(({ data }) => {
                    setForm({
                        title: data.title,
                        leetcodeUrl: data.leetcodeUrl || '',
                        difficulty: data.difficulty,
                        topics: data.topics,
                        notes: data.notes || '',
                        timeComplexity: data.timeComplexity || '',
                        dataStructure: data.dataStructure || '',
                        keyAlgorithmIdea: data.keyAlgorithmIdea || '',
                        solvedDate: new Date(data.solvedDate).toISOString().split('T')[0],
                    });
                })
                .catch(() => toast.error('Failed to load problem'))
                .finally(() => setFetching(false));
        }
    }, [id, isEdit]);

    const toggleTopic = (topic) => {
        setForm((prev) => ({
            ...prev,
            topics: prev.topics.includes(topic)
                ? prev.topics.filter((t) => t !== topic)
                : [...prev.topics, topic],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) return toast.error('Title is required');
        if (form.topics.length === 0) return toast.error('Select at least one topic');
        setLoading(true);
        try {
            if (isEdit) {
                await api.put(`/api/problems/${id}`, form);
                toast.success('Problem updated! ✅');
            } else {
                await api.post('/api/problems', form);
                toast.success('Problem added! 🎉');
            }
            navigate('/problems');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Save failed');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-brand-600/30 border-t-brand-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-slide-up">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-100">
                    {isEdit ? '✏️ Edit Problem' : '➕ Add Problem'}
                </h1>
                <p className="text-slate-400 mt-1">
                    {isEdit ? 'Update problem details' : 'Track a new solved problem'}
                </p>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Problem Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            className="input"
                            placeholder="e.g. Two Sum"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            required
                        />
                    </div>

                    {/* LeetCode URL */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">LeetCode URL</label>
                        <input
                            type="url"
                            className="input"
                            placeholder="https://leetcode.com/problems/two-sum/"
                            value={form.leetcodeUrl}
                            onChange={(e) => setForm({ ...form, leetcodeUrl: e.target.value })}
                        />
                    </div>

                    {/* Difficulty */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Difficulty <span className="text-red-400">*</span>
                        </label>
                        <div className="flex gap-3">
                            {['Easy', 'Medium', 'Hard'].map((d) => (
                                <button
                                    key={d}
                                    type="button"
                                    onClick={() => setForm({ ...form, difficulty: d })}
                                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${form.difficulty === d
                                        ? d === 'Easy' ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/50' :
                                            d === 'Medium' ? 'bg-yellow-500/20 text-yellow-600 border-yellow-500/50' :
                                                'bg-red-500/20 text-red-600 border-red-500/50'
                                        : 'bg-brand-500/5 text-slate-400 border-brand-500/10 hover:border-brand-500/30'
                                        }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Topics */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Topics <span className="text-red-400">*</span>
                            <span className="text-slate-500 font-normal ml-1">({form.topics.length} selected)</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {TOPICS.map((topic) => (
                                <button
                                    key={topic}
                                    type="button"
                                    onClick={() => toggleTopic(topic)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${form.topics.includes(topic)
                                        ? 'bg-brand-600/30 text-brand-600 border-brand-500/50'
                                        : 'bg-brand-500/5 text-slate-400 border-brand-500/10 hover:border-brand-500/30 hover:text-slate-300'
                                        }`}
                                >
                                    {form.topics.includes(topic) ? '✓ ' : ''}{topic}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Flashcard Data */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5 text-brand-400/80 uppercase tracking-widest font-black text-[10px]">Data Structure</label>
                            <input
                                type="text"
                                className="input h-10 text-sm"
                                placeholder="e.g. Hash Map, Segment Tree"
                                value={form.dataStructure}
                                onChange={(e) => setForm({ ...form, dataStructure: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5 text-brand-400/80 uppercase tracking-widest font-black text-[10px]">Time Complexity</label>
                            <input
                                type="text"
                                className="input h-10 text-sm"
                                placeholder="e.g. O(n log n)"
                                value={form.timeComplexity}
                                onChange={(e) => setForm({ ...form, timeComplexity: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5 text-brand-400/80 uppercase tracking-widest font-black text-[10px]">Key Algorithm Idea</label>
                        <input
                            type="text"
                            className="input h-10 text-sm"
                            placeholder="e.g. target - nums[i]"
                            value={form.keyAlgorithmIdea}
                            onChange={(e) => setForm({ ...form, keyAlgorithmIdea: e.target.value })}
                        />
                    </div>

                    {/* Solved Date */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Date Solved</label>
                        <input
                            type="date"
                            className="input"
                            value={form.solvedDate}
                            onChange={(e) => setForm({ ...form, solvedDate: e.target.value })}
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Notes / Approach</label>
                        <textarea
                            className="input min-h-[120px] resize-y"
                            placeholder="Describe your approach, key insights, time/space complexity..."
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                            {loading ? (
                                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                isEdit ? 'Update Problem' : 'Add Problem'
                            )}
                        </button>
                        <button type="button" onClick={() => navigate(-1)} className="btn-secondary px-6">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
