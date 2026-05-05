import { Resend } from 'resend';
import { sendNodemailerEmail } from './nodemailer';

// Initialize the Resend client
const apiKey = process.env.RESEND_API_KEY;
export const resend = apiKey && apiKey !== 're_123456789' && !apiKey.includes('your-')
  ? new Resend(apiKey)
  : null;

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

/**
 * Helper utility to send emails using the Resend API with an Ethereal fallback for development
 */
export const sendResendEmail = async ({ to, subject, html }: SendEmailParams) => {
  // If no Resend API key is configured, or we are specifically in a "placeholder" state, fallback immediately
  if (!resend) {
    console.log("🔧 Resend API key missing or placeholder. Falling back to Ethereal...");
    console.log("💡 To use real email delivery, configure RESEND_API_KEY in your .env.local file");
    console.log("📧 Check env-setup-guide.txt for instructions");
    return await sendNodemailerEmail({ to, subject, html });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'College Connect <onboarding@resend.dev>',
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend API Email Error:", error);
      console.log("Attempting fallback to Ethereal...");
      return await sendNodemailerEmail({ to, subject, html });
    }

    console.log("Resend Email successful. ID:", (data as { id: string })?.id);
    return { success: true, data };
  } catch (error) {
    console.error("Resend API Execution Error:", error);
    console.log("Attempting fallback to Ethereal...");
    return await sendNodemailerEmail({ to, subject, html });
  }
};
