const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create a transporter with final working config
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        family: 4,     // force IPv4
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            // Do not fail on invalid certs
            rejectUnauthorized: false,
        },
        connectionTimeout: 20000, // 20 seconds
        greetingTimeout: 10000,  // 10 seconds
        socketTimeout: 30000,    // 30 seconds
    });

    // 2. Enable debug logging
    transporter.verify((error, success) => {
        if (error) {
            console.error("SMTP ERROR:", error);
        } else {
            console.log("SMTP READY");
        }
    });

    // 3. Define the email options
    const mailOptions = {
        from: `CodeRecall <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    // 4. Actually send the email with error handling
    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error("EMAIL SEND ERROR:", err);
        throw err;
    }
};

module.exports = sendEmail;

