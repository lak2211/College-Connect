import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !(session.user as { id?: string }).id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { university, course, branch, semester, subjects } = await req.json();

    if (!course || !subjects || subjects.length === 0) {
      return NextResponse.json({ message: "Course and Subjects are required." }, { status: 400 });
    }

    await connectToDatabase();

    const userEmail = session.user.email;
    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      {
        university: university || "Maharshi Dayanand University (MDU)",
        course,
        branch,
        semester,
        subjects,
      },
      { new: true }
    );

    if (!updatedUser) {
      console.error(`User not found for email: ${userEmail}`);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Onboarding completed successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error updating onboarding:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
