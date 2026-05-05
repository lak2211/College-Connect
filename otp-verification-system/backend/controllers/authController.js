const OTP = require('../models/OTP');
const transporter = require('../config/transporter');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Send OTP
exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

        // Cooldown check (30 seconds)
        const existingOTP = await OTP.findOne({ email });
        if (existingOTP && (Date.now() - existingOTP.createdAt) < 30000) {
            return res.status(429).json({ success: false, message: 'Wait 30 seconds before resending' });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Update or Create OTP
        await OTP.findOneAndUpdate(
            { email },
            { otp, attempts: 0, createdAt: Date.now() },
            { upsert: true, new: true }
        );

        // Send Email
        console.log("OTP generated");
        const mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP is: ${otp}`
        };

        console.log("Sending email to user...");
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Email failed");
                console.error(error);
                return res.status(500).json({ success: false, message: 'Failed to send email' });
            }
            console.log("Email sent successfully");
            res.status(200).json({ success: true, message: 'OTP sent to your inbox' });
        });

    } catch (error) {
        console.error('SERVER ERROR (sendOTP):', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP required' });

        const record = await OTP.findOne({ email });

        if (!record) {
            return res.status(400).json({ success: false, message: 'OTP expired or not requested' });
        }

        // Brute force protection: max 5 attempts
        if (record.attempts >= 5) {
            return res.status(429).json({ success: false, message: 'Too many attempts. Request a new OTP.' });
        }

        if (record.otp === otp) {
            // Success
            await OTP.deleteOne({ email });
            return res.status(200).json({ success: true, message: 'OTP verified successfully' });
        } else {
            // Failure: Increment attempts
            await OTP.updateOne({ email }, { $inc: { attempts: 1 } });
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

    } catch (error) {
        console.error('SERVER ERROR (verifyOTP):', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Helper: Hash password (for your future user model)
exports.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Helper: Verify password
exports.verifyPassword = async (password, hashed) => {
    return await bcrypt.compare(password, hashed);
};
exports.testEmail = async (req, res) => {
    const email = req.query.email || process.env.EMAIL_USER;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Nodemailer Test Email',
        text: 'If you are reading this, your Nodemailer transporter is working perfectly!'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('TEST MAIL FAILED:', error);
            return res.status(500).send(`Test Email Failed: ${error.message}`);
        }
        console.log('Test email sent successfully');
        res.status(200).send('Email sent successfully! Check your terminal and inbox.');
    });
};
