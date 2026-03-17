import { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [payments, setPayments] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('stats');

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [usersRes, paymentsRes, statsRes] = await Promise.all([
                    axios.get('/admin/users'),
                    axios.get('/admin/payments'),
                    axios.get('/admin/stats')
                ]);
                setUsers(usersRes.data);
                setPayments(paymentsRes.data);
                setStats(statsRes.data);
            } catch (error) {
                console.error('Error fetching admin data:', error);
            } finally {
                setLoading(loading => false);
            }
        };

        fetchAdminData();
    }, []);

    if (loading) return <div className="text-center py-20 text-slate-100 italic">Loading Admin Dashboard...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold mb-8 text-slate-100">Admin Dashboard</h1>

            {/* Stats Overview */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="card glass !p-6">
                        <p className="text-sm text-slate-400">Total Users</p>
                        <p className="text-2xl font-bold text-slate-100">{stats.totalUsers}</p>
                    </div>
                    <div className="card glass !p-6">
                        <p className="text-sm text-slate-400">Total Transactions</p>
                        <p className="text-2xl font-bold text-slate-100">{stats.totalTransactions}</p>
                    </div>
                    <div className="card glass !p-6">
                        <p className="text-sm text-slate-400">Total Revenue</p>
                        <p className="text-2xl font-bold text-slate-100">₹{stats.totalRevenue}</p>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 rounded-lg transition-colors border ${activeTab === 'users' ? 'bg-brand-600 text-white border-brand-600' : 'text-slate-300'}`}
                    style={activeTab !== 'users' ? { backgroundColor: 'var(--surface-accent)', borderColor: 'var(--border-muted)' } : {}}
                >
                    Users
                </button>
                <button
                    onClick={() => setActiveTab('payments')}
                    className={`px-4 py-2 rounded-lg transition-colors border ${activeTab === 'payments' ? 'bg-brand-600 text-white border-brand-600' : 'text-slate-300'}`}
                    style={activeTab !== 'payments' ? { backgroundColor: 'var(--surface-accent)', borderColor: 'var(--border-muted)' } : {}}
                >
                    Payments
                </button>
            </div>

            {/* Content */}
            <div className="card glass !p-0 overflow-hidden">
                {activeTab === 'users' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-sm" style={{ backgroundColor: 'var(--surface-accent)' }}>
                                <tr className="text-slate-100" style={{ borderBottom: '1px solid var(--border-muted)' }}>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y" style={{ borderColor: 'var(--border-muted)' }}>
                                {users.map(user => (
                                    <tr key={user._id} className="hover:bg-slate-500/5 transition-colors">
                                        <td className="px-6 py-4">{user.name}</td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'payments' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-sm" style={{ backgroundColor: 'var(--surface-accent)' }}>
                                <tr className="text-slate-100" style={{ borderBottom: '1px solid var(--border-muted)' }}>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Order ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y" style={{ borderColor: 'var(--border-muted)' }}>
                                {payments.map(payment => (
                                    <tr key={payment._id} className="hover:bg-slate-500/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-medium">{payment.userId?.name}</p>
                                            <p className="text-xs text-slate-400">{payment.userId?.email}</p>
                                        </td>
                                        <td className="px-6 py-4">₹{payment.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${payment.status === 'captured' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{new Date(payment.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-xs font-mono">{payment.orderId}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
