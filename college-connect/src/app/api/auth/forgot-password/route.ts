import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { generateOtp, generateOtpExpiration } from "@/lib/otp";
import { generatePasswordResetTemplate } from "@/templates/email-templates";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    await connectDB();

    // Convert email to lowercase to handle case sensitivity
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log(`[Forgot Password] User not found for email: ${email}`);
      // Return success even if user not found to prevent email enumeration
      return NextResponse.json({ message: "If that email exists, a reset link has been sent." }, { status: 200 });
    }

    // Generate 6-digit OTP and set expiration time to 10 minutes from now
    const resetOtp = generateOtp();
    const expiresAt = generateOtpExpiration();

    user.resetPasswordOtp = resetOtp;
    user.resetPasswordOtpExpires = expiresAt;

    // Clear the old token fields if they exist
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Send email using Nodemailer
    const { sendNodemailerEmail } = await import("@/lib/nodemailer");
    const subject = "Your OTP Code";
    const html = `Your OTP is: ${resetOtp}`;

    console.log(`Sending email to user...`);
    const emailResponse = await sendNodemailerEmail({ to: user.email, subject, html });

    if (!emailResponse.success) {
      console.log(`Email failed for ${email}`);
    } else {
      console.log(`Email sent successfully to ${email}`);
    }

    return NextResponse.json({
      message: "If that email exists, an OTP has been sent."
    }, { status: 200 });
  } catch (error: unknown) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "An error occurred during password reset" }, { status: 500 });
  }
}
