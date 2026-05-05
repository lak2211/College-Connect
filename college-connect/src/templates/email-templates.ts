export const generateOtpTemplate = (otp: string) => `
<div style="font-family: 'Inter', Helvetica, Arial, sans-serif; padding: 40px 20px; background-color: #f8fafc; color: #0f172a; max-width: 600px; margin: 0 auto; border-radius: 12px; border: 1px solid #e2e8f0;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; margin: 0; font-size: 28px;">College Connect</h1>
  </div>
  <div style="background-color: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
    <h2 style="margin-top: 0; font-size: 20px; color: #1e293b;">Verify Your Account</h2>
    <p style="font-size: 16px; line-height: 1.5; color: #475569;">You are one step away from joining our academic ecosystem. Here is your One-Time Password (OTP) to securely verify your email address:</p>
    <div style="font-size: 32px; font-weight: 800; background-color: #f1f5f9; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0; letter-spacing: 8px; color: #0f172a;">
      ${otp}
    </div>
    <p style="font-size: 14px; color: #64748b; margin-bottom: 0;">This OTP will expire in 10 minutes. If you did not attempt to register an account with College Connect, please disregard this email.</p>
  </div>
  <div style="text-align: center; margin-top: 30px; font-size: 14px; color: #94a3b8;">
    <p>© ${new Date().getFullYear()} College Connect. All rights reserved.</p>
  </div>
</div>
`;

export const generatePasswordResetTemplate = (otp: string) => `
<div style="font-family: 'Inter', Helvetica, Arial, sans-serif; padding: 40px 20px; background-color: #f8fafc; color: #0f172a; max-width: 600px; margin: 0 auto; border-radius: 12px; border: 1px solid #e2e8f0;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; margin: 0; font-size: 28px;">College Connect</h1>
  </div>
  <div style="background-color: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
    <h2 style="margin-top: 0; font-size: 20px; color: #1e293b;">Reset Your Password</h2>
    <p style="font-size: 16px; line-height: 1.5; color: #475569;">We received a request to securely reset your College Connect student dashboard password. Enter the One-Time Password (OTP) below to proceed:</p>
    <div style="font-size: 32px; font-weight: 800; background-color: #f1f5f9; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0; letter-spacing: 8px; color: #0f172a;">
      ${otp}
    </div>
    <p style="font-size: 14px; color: #64748b; margin-bottom: 0;">This secure code expires in 10 minutes. If you did not request a password reset, you can safely ignore this email.</p>
  </div>
  <div style="text-align: center; margin-top: 30px; font-size: 14px; color: #94a3b8;">
    <p>© ${new Date().getFullYear()} College Connect. All rights reserved.</p>
  </div>
</div>
`;
export const generateResetLinkTemplate = (resetUrl: string) => `
<div style="font-family: 'Inter', Helvetica, Arial, sans-serif; padding: 40px 20px; background-color: #f8fafc; color: #0f172a; max-width: 600px; margin: 0 auto; border-radius: 12px; border: 1px solid #e2e8f0;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; margin: 0; font-size: 28px;">College Connect</h1>
  </div>
  <div style="background-color: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
    <h2 style="margin-top: 0; font-size: 20px; color: #1e293b;">Reset Your Password</h2>
    <p style="font-size: 16px; line-height: 1.5; color: #475569;">We received a request to securely reset your College Connect student dashboard password. Click the secure link below to proceed:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">Reset Password</a>
    </div>
    <p style="font-size: 14px; color: #64748b; margin-top: 20px; overflow-wrap: break-word; word-break: break-all;">
      Or copy and paste this link into your browser:<br>
      <a href="${resetUrl}" style="color: #2563eb;">${resetUrl}</a>
    </p>
    <p style="font-size: 14px; color: #64748b; margin-top: 20px; margin-bottom: 0;">This secure link expires in 10 minutes. If you did not request a password reset, you can safely ignore this email.</p>
  </div>
  <div style="text-align: center; margin-top: 30px; font-size: 14px; color: #94a3b8;">
    <p>© ${new Date().getFullYear()} College Connect. All rights reserved.</p>
  </div>
</div>
`;
