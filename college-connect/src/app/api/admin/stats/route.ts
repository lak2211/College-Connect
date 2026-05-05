import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Resource from "@/models/Resource";
import Contact from "@/models/Contact";

export async function GET(_req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role?: string })?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Get counts
    const totalStudents = await User.countDocuments({ role: { $ne: "admin" } });
    const totalResources = await Resource.countDocuments();
    const unreadMessages = await Contact.countDocuments({ status: "unread" });

    // Recent students (last 10)
    const recentStudents = await User.find({ role: { $ne: "admin" } })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("name email course branch semester createdAt");

    // Recent resources (last 10)
    const recentResources = await Resource.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title subject type course year fileUrl createdAt");

    // Recent contacts (last 5)
    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("firstName lastName subject email status createdAt");

    // Count by type
    const pyqCount = await Resource.countDocuments({ type: "PYQ" });
    const notesCount = await Resource.countDocuments({ type: "Notes" });
    const videoCount = await Resource.countDocuments({ type: "Video" });

    return NextResponse.json({
      stats: {
        totalStudents,
        totalResources,
        unreadMessages,
        pyqCount,
        notesCount,
        videoCount,
      },
      recentStudents,
      recentResources,
      recentContacts,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
