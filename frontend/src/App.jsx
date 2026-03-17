import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import AddProblem from './pages/AddProblem';
import Review from './pages/Review';
import ProblemManager from './pages/ProblemManager';
import CalendarPage from './pages/Calendar';
import AlgorithmsPage from './pages/Algorithms';
import RecallPage from './pages/Recall';
import RecallSessionPage from './pages/RecallSession';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';



import Paywall from './pages/Paywall';
import DemoPage from './pages/DemoPage';

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
    const { user } = useAuth();
    return !user ? children : <Navigate to="/" replace />;
};

// Requires login AND payment (admin bypasses paywall)
const PaidRoute = ({ children }) => {
    const { user } = useAuth();
    const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || 'coderecallapp@gmail.com').toLowerCase().trim();
    if (!user) return <Navigate to="/login" replace />;
    const isAdmin = user.email?.toLowerCase().trim() === ADMIN_EMAIL;
    if (!isAdmin && !user.isPaid) return <Navigate to="/demo" replace />;
    return children;
};

export default function App() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen">
            {user && <Navbar />}
            <main className={user ? 'pt-16' : ''}>
                <Routes>
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                    <Route path="/paywall" element={<PrivateRoute><Paywall /></PrivateRoute>} />
                    <Route path="/demo" element={<PrivateRoute><DemoPage /></PrivateRoute>} />
                    <Route path="/" element={<PaidRoute><Dashboard /></PaidRoute>} />
                    <Route path="/problems" element={<PaidRoute><Problems /></PaidRoute>} />
                    <Route path="/manage" element={<PaidRoute><ProblemManager /></PaidRoute>} />
                    <Route path="/calendar" element={<PaidRoute><CalendarPage /></PaidRoute>} />
                    <Route path="/algorithms" element={<PaidRoute><AlgorithmsPage /></PaidRoute>} />
                    <Route path="/add" element={<PaidRoute><AddProblem /></PaidRoute>} />
                    <Route path="/edit/:id" element={<PaidRoute><AddProblem /></PaidRoute>} />
                    <Route path="/review" element={<PaidRoute><Review /></PaidRoute>} />
                    <Route path="/recall" element={<PaidRoute><RecallPage /></PaidRoute>} />
                    <Route path="/recall/:id" element={<PaidRoute><RecallSessionPage /></PaidRoute>} />
                    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    );
}
