import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('/api/auth/forgot-password', { email });
            toast.success('Reset link sent to your email!');
            setSent(true);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full card glass p-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Forgot Password?</h1>
                    <p className="text-slate-600 dark:text-slate-400">Enter your email and we'll send you a link to reset your password.</p>
                </div>

                {!sent ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field w-full py-3"
                                placeholder="name@example.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="text-center space-y-6">
                        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-3xl">
                            ✓
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">Check your inbox for the reset link! If you don't see it, check your spam folder.</p>
                    </div>
                )}

                <p className="mt-8 text-center text-sm text-slate-500">
                    Remember your password? <Link to="/login" className="text-brand-500 font-bold hover:underline">Log In</Link>
                </p>
            </motion.div>
        </div>
    );
}
