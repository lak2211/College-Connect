const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

// Verify connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('--- Gmail Transporter Error ---');
        console.error(error);
    } else {
        console.log('--- Gmail SMTP Server is ready to take our messages ---');
    }
});

module.exports = transporter;
