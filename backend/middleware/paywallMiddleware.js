const paywallMiddleware = (req, res, next) => {
    const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'coderecallapp@gmail.com').toLowerCase().trim();
    const isAdmin = req.user?.email?.toLowerCase().trim() === ADMIN_EMAIL;

    if (req.user && !req.user.isPaid && !isAdmin) {
        return res.status(403).json({
            message: 'Payment Required',
            requirePayment: true
        });
    }
    next();
};

module.exports = paywallMiddleware;
