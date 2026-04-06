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

// Feature routes - all require auth AND premium/admin
app.use('/api/problems', protect, requirePremium, require('./routes/problemRoutes'));
app.use('/api/dashboard', protect, requirePremium, require('./routes/dashboardRoutes'));
app.use('/api/analytics', protect, requirePremium, require('./routes/analyticsRoutes'));
app.use('/api/algorithms', protect, requirePremium, require('./routes/algorithmRoutes'));
app.use('/api/revision', protect, requirePremium, require('./routes/revisionRoutes'));
app.use('/api/admin', protect, requirePremium, require('./routes/adminRoutes'));

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
