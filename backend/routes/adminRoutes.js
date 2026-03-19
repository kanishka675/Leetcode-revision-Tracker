const express = require('express');
const router = express.Router();
const { getUsers, getPayments, getDashboardStats, deleteUser, deletePayment } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

router.get('/users', protect, isAdmin, getUsers);
router.get('/payments', protect, isAdmin, getPayments);
router.get('/stats', protect, isAdmin, getDashboardStats);
router.delete('/user/:id', protect, isAdmin, deleteUser);
router.delete('/payment/:id', protect, isAdmin, deletePayment);

module.exports = router;
