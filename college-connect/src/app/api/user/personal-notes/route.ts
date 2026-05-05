import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import PersonalNote from "@/models/PersonalNote";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Login required" }, { status: 401 });

    const { videoId, title, content, subject } = await req.json();
    if (!videoId || !title || !content || !subject) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();
    
    // UPSERT: If note for this video + user already exists, update it.
    const personalNote = await PersonalNote.findOneAndUpdate(
      { user: session.user.id, video: videoId },
      { title, content, subject, createdAt: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: "Note saved successfully", note: personalNote }, { status: 201 });
  } catch (error) {
    console.error("Personal note error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Login required" }, { status: 401 });

    await connectToDatabase();
    const notes = await PersonalNote.find({ user: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error("Personal note fetch error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
