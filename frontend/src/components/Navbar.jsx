import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const links = [
        { to: '/', label: 'Dashboard', icon: '📊' },
        { to: '/algorithms', label: 'Visualize', icon: '🔮' },
        { to: '/manage', label: 'Manage', icon: '📋' },
        { to: '/calendar', label: 'Calendar', icon: '📅' },
        { to: '/review', label: 'Review', icon: '🔁' },
        { to: '/add', label: 'Add', icon: '➕' },
    ];

    const isActive = (path) =>
        path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-brand-500/10 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-brand-600/40">
                            LC
                        </div>
                        <span className="font-bold text-slate-100 hidden sm:block">
                            Smart <span className="text-brand-400">Tracker</span>
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {links.map(({ to, label, icon }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(to)
                                        ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30'
                                        : 'text-slate-400 hover:text-slate-100 hover:bg-dark-700'
                                    }`}
                            >
                                <span>{icon}</span>
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* User + Toggle + Logout */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-dark-700/50 hover:bg-dark-600 border border-dark-500 text-slate-400 transition-all duration-200"
                            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>

                        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
                            <div className="w-7 h-7 bg-brand-600/30 rounded-full flex items-center justify-center text-brand-400 font-semibold text-xs border border-brand-500/30">
                                {user?.name?.[0]?.toUpperCase()}
                            </div>
                            <span className="font-medium text-slate-300">{user?.name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-slate-400 hover:text-red-400 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all duration-200"
                        >
                            Logout
                        </button>
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden text-slate-400 hover:text-slate-200 p-2"
                        >
                            {menuOpen ? '✕' : '☰'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden glass border-t border-brand-500/10 px-4 py-3 space-y-1">
                    {links.map(({ to, label, icon }) => (
                        <Link
                            key={to}
                            to={to}
                            onClick={() => setMenuOpen(false)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive(to)
                                    ? 'bg-brand-600/20 text-brand-400'
                                    : 'text-slate-400 hover:text-slate-100 hover:bg-dark-700'
                                }`}
                        >
                            {icon} {label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}
