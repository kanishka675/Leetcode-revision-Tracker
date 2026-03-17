import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

export default function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: new URLSearchParams(location.search).get('email') || '',
        code: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Verify Code, 2: Reset Password

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/verify-reset-code', { email: form.email, code: form.code });
            toast.success('Code verified! Set your new password. 🗝️');
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid or expired code');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        setLoading(true);
        try {
            await api.post('/auth/reset-password', {
                email: form.email,
                code: form.code,
                password: form.password
            });
            toast.success('Password reset successful! Please login. 🎉');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Reset failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md animate-slide-up">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-600 rounded-2xl shadow-2xl shadow-brand-600/40 mb-4">
                        <span className="text-2xl font-bold text-white">{step === 1 ? '6#' : '🗝️'}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-100">{step === 1 ? 'Verify' : 'New'} <span className="text-brand-400">{step === 1 ? 'Code' : 'Password'}</span></h1>
                    <p className="text-slate-400 mt-1">
                        {step === 1 ? `Enter the 6-digit code sent to ${form.email}` : 'Enter your new secure password'}
                    </p>
                </div>

                <div className="card shadow-2xl">
                    {step === 1 ? (
                        <form onSubmit={handleVerifyCode} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Verification Code</label>
                                <input
                                    type="text"
                                    name="code"
                                    maxLength="6"
                                    className="input text-center text-2xl tracking-[1em] font-mono"
                                    placeholder="000000"
                                    value={form.code}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    'Verify Code'
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">New Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="input"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="input"
                                    placeholder="••••••••"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                        </form>
                    )}

                    <p className="text-center text-slate-400 text-sm mt-6">
                        <button onClick={() => setStep(1)} className="text-brand-400 font-medium hover:text-brand-300">
                            {step === 2 ? 'Back to Verify Code' : ''}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
