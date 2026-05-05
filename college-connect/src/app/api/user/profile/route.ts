import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as { id?: string; name?: string; email?: string; role?: string };
    if (!sessionUser || !sessionUser.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Handle hardcoded admin case
    if (sessionUser.role === "admin" && sessionUser.id === "000000000000000000000000") {
      return NextResponse.json({
        name: session.user.name,
        email: session.user.email,
        role: "admin",
      });
    }

    await connectToDatabase();
    const user = await User.findById(sessionUser.id).select("name email university course branch semester subjects role");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      university: user.university,
      course: user.course,
      branch: user.branch,
      semester: user.semester,
      subjects: user.subjects || [],
      role: user.role,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as { id?: string; name?: string; email?: string; role?: string };
    if (!sessionUser || !sessionUser.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { subjects } = body;

    if (!Array.isArray(subjects)) {
      return NextResponse.json({ message: "Invalid subjects format" }, { status: 400 });
    }

    await connectToDatabase();

    // Update user's subjects
    const updatedUser = await User.findByIdAndUpdate(
      sessionUser.id,
      { $set: { subjects } },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Subjects updated successfully", subjects: updatedUser.subjects }, { status: 200 });
  } catch (error) {
    console.error("Error updating subjects:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
