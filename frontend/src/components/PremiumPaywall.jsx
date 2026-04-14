import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useTheme } from '../context/ThemeContext';

const PremiumPaywall = ({ isOpen, onClose, featureName, description }) => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        if (isOpen && featureName) {
            // Track paywall hit
            api.post('/analytics/track-interaction', {
                featureName,
                interactionType: 'paywall_view'
            }).catch(console.error);
        }
    }, [isOpen, featureName]);

    // Prevent scrolling on body when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 cursor-pointer"
            />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl transition-colors duration-300 my-auto"
                style={{ 
                    backgroundColor: 'var(--card-bg)', 
                    border: '1px solid var(--border-color)',
                    maxHeight: 'calc(100vh - 2rem)'
                }}
            >
                {/* Decorative background Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />

                <div className="p-6 sm:p-10 text-center relative z-10 overflow-y-auto max-h-[calc(100vh-2rem)] custom-scrollbar">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-500/10 border border-brand-500/20 mb-4 sm:mb-6 group">
                        <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-300">🚀</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                        Unlock <span className="text-brand-400">Premium Features</span> 🚀
                    </h2>
                    
                    <p className="text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {featureName ? (
                            <>The <span className="font-bold underline decoration-brand-500/30" style={{ color: 'var(--text-primary)' }}>{featureName}</span> feature is available with Premium. Unlock the full potential of your coding prep.</>
                        ) : (
                            description || "Focus on your growth with advanced tools designed for top-tier engineering interviews."
                        )}
                    </p>

                    <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-8 sm:mb-10 text-left">
                        {[
                            { icon: '📚', text: 'Full Algorithm Library (DFS, BFS, Dijkstra, DP)' },
                            { icon: '🧪', text: 'Unlimited Code Visualization & Execution' },
                            { icon: '📈', text: 'Smart Revision System + Progress Analytics' },
                        ].map((item, i) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * i }}
                                key={i} 
                                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl transition-all border"
                                style={{ 
                                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                                    borderColor: 'var(--border-color)'
                                }}
                            >
                                <span className="text-xl sm:text-2xl">{item.icon}</span>
                                <span className="text-xs sm:text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>{item.text}</span>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => {
                                // Track upgrade click
                                api.post('/analytics/track-interaction', {
                                    featureName: featureName || 'general',
                                    interactionType: 'click_locked'
                                }).catch(console.error);
                                onClose(); // Close the modal
                                navigate('/paywall');
                            }}
                            className="btn-primary w-full py-4 text-base sm:text-lg"
                        >
                            Upgrade Now
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full bg-transparent hover:bg-black/5 dark:hover:bg-white/5 font-bold py-3 px-6 rounded-2xl transition-all text-sm"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            Maybe Later
                        </button>
                    </div>
                    
                    <p className="mt-6 sm:mt-8 text-[10px] uppercase tracking-widest font-black" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>
                        Join 5,000+ developers accelerating their career
                    </p>
                </div>
            </motion.div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default PremiumPaywall;
