import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, university, course, branch, subjects } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    await User.create({
      name,
      email,
      password: hashedPassword,
      university: university || "Maharshi Dayanand University (MDU)",
      course,
      branch,
      subjects,
      isVerified: false,
      verifyOtp: otp,
      verifyOtpExpires: expiresAt,
    });

    // Send the OTP email using Nodemailer
    const { sendNodemailerEmail } = await import("@/lib/nodemailer");
    
    const subject = "Your OTP Code";
    const html = `Your OTP is: ${otp}`;

    console.log(`OTP generated for ${email}: ${otp}`);
    console.log(`Sending email to user...`);

    const emailResponse = await sendNodemailerEmail({ to: email, subject, html });

    if (!emailResponse.success) {
      console.log(`Email failed for ${email}`);
    } else {
      console.log(`Email sent successfully to ${email}`);
    }

    return NextResponse.json(
      {
        message: "Registration initiated. Please verify your OTP.",
        email
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
