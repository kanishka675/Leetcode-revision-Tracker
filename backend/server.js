const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const { protect, requirePremium } = require('./middleware/authMiddleware');

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));

// Feature routes (requirePremium removed here to allow freemium logic inside controllers)
app.use('/api/problems', protect, require('./routes/problemRoutes'));
app.use('/api/dashboard', protect, require('./routes/dashboardRoutes'));
app.use('/api/analytics', protect, require('./routes/analyticsRoutes'));
app.use('/api/algorithms', protect, require('./routes/algorithmRoutes'));
app.use('/api/revision', protect, require('./routes/revisionRoutes'));
app.use('/api/usage', protect, require('./routes/usageRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/suggestions', require('./routes/suggestionRoutes'));

// Health check
app.get('/', (req, res) => res.json({ message: '🚀 CodeRecall API running' }));

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
