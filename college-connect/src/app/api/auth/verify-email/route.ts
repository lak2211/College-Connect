import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: "Email and OTP are required." }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({
      email,
      verifyOtp: otp,
      verifyOtpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired OTP." }, { status: 400 });
    }

    // Verify user and clear OTP fields
    user.isVerified = true;
    user.verifyOtp = undefined;
    user.verifyOtpExpires = undefined;

    await user.save();

    return NextResponse.json({ message: "Email verified successfully." }, { status: 200 });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { message: "An error occurred during verification." },
      { status: 500 }
    );
  }
}
