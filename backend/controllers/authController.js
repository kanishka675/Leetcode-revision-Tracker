const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc  Register new user
// @route POST /api/auth/register
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpiry: Date.now() + 5 * 60 * 1000 // 5 minutes
        });

        const message = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Email Verification</h2>
                <p>Hello ${name},</p>
                <p>Your OTP for verifying your CodeRecall account is:</p>
                <h1 style="background: #f4f4f5; padding: 10px; border-radius: 5px; text-align: center; letter-spacing: 5px;">${otp}</h1>
                <p>This OTP will expire in 5 minutes.</p>
            </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Your OTP for Verification - CodeRecall',
                html: message,
            });

            res.status(201).json({
                message: 'OTP sent to email! Please check your inbox.',
            });
        } catch (error) {
            user.otp = undefined;
            user.otpExpiry = undefined;
            await user.save();
            return res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc  Login user
// @route POST /api/auth/login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            if (!user.isVerified) {
                return res.status(401).json({ message: 'Please verify OTP first' });
            }

            const token = generateToken(user._id);
            user.currentSessionToken = token;
            await user.save();

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isPaid: user.isPaid,
                token: token,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc  Verify OTP
// @route POST /api/auth/verify-otp
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.json({ message: 'Account verified successfully! You can now login.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc  Resend OTP
// @route POST /api/auth/resend-otp
const resendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
        await user.save();

        const message = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Email Verification</h2>
                <p>Hello ${user.name},</p>
                <p>Your new OTP for verifying your CodeRecall account is:</p>
                <h1 style="background: #f4f4f5; padding: 10px; border-radius: 5px; text-align: center; letter-spacing: 5px;">${otp}</h1>
                <p>This OTP will expire in 5 minutes.</p>
            </div>
        `;

        await sendEmail({
            email: user.email,
            subject: 'New OTP for Verification - CodeRecall',
            html: message,
        });

        res.json({ message: 'A new OTP has been sent to your email.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc  Forgot password
// @route POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.tokenExpiry = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        const message = `
            <h1>Reset your password</h1>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
        `;

        await sendEmail({
            email: user.email,
            subject: 'Password Reset - CodeRecall',
            html: message,
        });

        res.json({ message: 'Password reset email sent!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc  Reset password
// @route POST /api/auth/reset-password
const resetPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            tokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.tokenExpiry = undefined;
        await user.save();

        res.json({ message: 'Password reset successful! You can now login.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc  Google Login
// @route POST /api/auth/google
const googleLogin = async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, sub } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            // Create user for Google login (auto-verified)
            user = await User.create({
                name,
                email,
                password: crypto.randomBytes(16).toString('hex'), // Random password for Google users
                isVerified: true,
            });
        }

        const generatedToken = generateToken(user._id);
        user.currentSessionToken = generatedToken;
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isPaid: user.isPaid,
            token: generatedToken,
        });
    } catch (error) {
        res.status(401).json({ message: 'Google authentication failed' });
    }
};

// @desc  Logout user
// @route POST /api/auth/logout
const logoutUser = async (req, res) => {
    try {
        if (req.user) {
            req.user.currentSessionToken = null;
            await req.user.save();
        }
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc  Get current user
// @route GET /api/auth/me
const getMe = async (req, res) => {
    res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        isPaid: req.user.isPaid,
    });
};

module.exports = {
    registerUser,
    loginUser,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    googleLogin,
    logoutUser,
    getMe,
};
