const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    // STEP 1 — ENV variable check
    console.log("EMAIL_USER:", user);
    console.log("EMAIL_PASS:", pass ? "Loaded" : "Missing");

    // STEP 2 — Create transporter with debug mode enabled
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        family: 4,     // force IPv4
        auth: {
            user: user,
            pass: pass,
        },
        tls: {
            rejectUnauthorized: false,
        },
        connectionTimeout: 30000,
        greetingTimeout: 20000,
        socketTimeout: 45000,
        debug: true,   // STEP 5 — enables detailed SMTP debug output
        logger: true,  // STEP 5 — logs to console
    });

    console.log("Transporter created"); // STEP 2 log

    // STEP 3 — Verify SMTP connection with detailed error
    try {
        await transporter.verify();
        console.log("✅ SMTP READY (Verified)");
    } catch (error) {
        console.error("❌ SMTP VERIFICATION FAILED");
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Full error:", error);
        // Still attempt to send, so the caller gets the real send error if any
    }

    // Define mail options
    const mailOptions = {
        from: `CodeRecall <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    // STEP 4 — Send mail with detailed error handling
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ EMAIL SENT SUCCESSFULLY");
        console.log("Response:", info.response);
    } catch (error) {
        console.error("❌ EMAIL SEND FAILED");
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Full error:", error);
        throw error;
    }
};

module.exports = sendEmail;
