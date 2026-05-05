import { sendResendEmail } from './src/lib/resend';

async function testEmail() {
  console.log('🧪 Testing email configuration...\n');

  const result = await sendResendEmail({
    to: 'test@example.com',
    subject: 'College Connect - Email Test',
    html: `
      <h2>🎉 Email Test Successful!</h2>
      <p>If you receive this email, your email configuration is working correctly.</p>
      <p>Time sent: ${new Date().toLocaleString()}</p>
    `
  });

  if (result.success) {
    console.log('✅ Email sent successfully!');
    if (result.previewUrl) {
      console.log('📧 Preview URL (for Ethereal emails):', result.previewUrl);
    }
  } else {
    console.log('❌ Email failed to send:', result.error);
  }
}

testEmail().catch(console.error);
