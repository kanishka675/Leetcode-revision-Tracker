const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            
            if (user && user.currentSessionToken !== token) {
                return res.status(401).json({ message: 'Session expired. Logged in from another device.' });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const requirePremium = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, no user' });
    }

    const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'coderecallapp@gmail.com').toLowerCase().trim();
    const isAdmin = req.user.email?.toLowerCase().trim() === ADMIN_EMAIL;

    // Allow access if user is admin OR has paid/premium status
    if (isAdmin || req.user.isPremium || req.user.isPaid) {
        return next();
    }

    return res.status(403).json({ 
        message: 'Premium access required',
        requirePayment: true 
    });
};

module.exports = { protect, requirePremium };
