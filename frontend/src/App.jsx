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


const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
    const { user } = useAuth();
    return !user ? children : <Navigate to="/" replace />;
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
                    <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/problems" element={<PrivateRoute><Problems /></PrivateRoute>} />
                    <Route path="/manage" element={<PrivateRoute><ProblemManager /></PrivateRoute>} />
                    <Route path="/calendar" element={<PrivateRoute><CalendarPage /></PrivateRoute>} />
                    <Route path="/algorithms" element={<PrivateRoute><AlgorithmsPage /></PrivateRoute>} />
                    <Route path="/add" element={<PrivateRoute><AddProblem /></PrivateRoute>} />
                    <Route path="/edit/:id" element={<PrivateRoute><AddProblem /></PrivateRoute>} />
                    <Route path="/review" element={<PrivateRoute><Review /></PrivateRoute>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    );
}
