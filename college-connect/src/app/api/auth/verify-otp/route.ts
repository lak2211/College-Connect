import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { isOtpExpired } from "@/lib/otp";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json({ message: "Invalid email or OTP" }, { status: 400 });
    }

    // Check if OTP exists and matches
    if (!user.resetPasswordOtp || user.resetPasswordOtp !== otp) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    // Check if OTP is expired
    if (!user.resetPasswordOtpExpires || isOtpExpired(user.resetPasswordOtpExpires)) {
      return NextResponse.json({ message: "OTP has expired. Please request a new one." }, { status: 400 });
    }

    // OTP is valid - return success with user email for password reset
    return NextResponse.json({ 
      message: "OTP verified successfully",
      email: user.email 
    }, { status: 200 });

  } catch (error: unknown) {
    console.error("OTP verification error:", error);
    return NextResponse.json({ message: "An error occurred during OTP verification" }, { status: 500 });
  }
}
