const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    console.log(`Attempting to send email using: ${user} (Pass length: ${pass ? pass.length : 0})`);

    // 1. Create a transporter with final working config
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
            // Do not fail on invalid certs
            rejectUnauthorized: false,
        },
        connectionTimeout: 30000, // Increased to 30 seconds
        greetingTimeout: 20000,  // Increased to 20 seconds
        socketTimeout: 45000,    // Increased to 45 seconds
    });

    // 2. Enable debug logging with a promise to wait for it if needed
    try {
        await transporter.verify();
        console.log("SMTP READY (Verified)");
    } catch (verifyError) {
        console.error("SMTP VERIFICATION FAILED:", verifyError);
        // We still try to send, but now we know it's a connection issue
    }


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

