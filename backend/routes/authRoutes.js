const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    googleLogin,
    logoutUser,
    getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);

module.exports = router;
