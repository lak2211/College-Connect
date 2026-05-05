import nodemailer from 'nodemailer';

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
}

/**
 * Utility to send REAL emails using Gmail SMTP
 */
export const sendNodemailerEmail = async ({ to, subject, html }: SendEmailParams) => {
    try {
        console.log("Sending email to user...");

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        const info = await transporter.sendMail({
            from: `"College Connect Support" <${process.env.MAIL_USERNAME}>`,
            to,
            subject,
            html,
        });

        console.log("Email sent successfully. Message ID:", info.messageId);

        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Email failed. Error:", error);
        return { success: false, error };
    }
};
