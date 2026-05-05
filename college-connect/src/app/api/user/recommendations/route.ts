import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Resource from "@/models/Resource";
import User from "@/models/User";

export async function GET(_req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Get user subjects and additional info for ML
    const user = await User.findOne({ email: session.user.email });
    const userSubjects = user?.subjects || [];
    const course = user?.course || "";
    const userId = user?._id.toString() || "";

    let recommendations: Record<string, unknown>[] = []; // Hold MongoDB docs or FastAPI objects

    // 1. Attempt to get recommendations from FastAPI Backend
    const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";
    try {
      const backendRes = await fetch(`${BACKEND_URL}/ml/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          course: course,
          subjects: userSubjects,
          progress: {} // Expand this if you have real progress data
        }),
      });

      if (backendRes.ok) {
        const data = await backendRes.json();
        if (data.status === "success" && data.recommendations) {
          recommendations = data.recommendations;
          console.log("Successfully fetched ML recommendations from FastAPI");
        }
      }
    } catch (err) {
      console.error("FastAPI Backend unreachable, falling back to local MongoDB logic:", err);
    }

    // 2. Fallback Logic: If backend failed or returned nothing, use MongoDB
    if (recommendations.length === 0) {
      if (userSubjects.length > 0) {
        recommendations = await Resource.find({ subject: { $in: userSubjects } })
          .sort({ createdAt: -1 })
          .limit(4);
      }
      
      if (recommendations.length === 0) {
        recommendations = await Resource.find()
          .sort({ createdAt: -1 })
          .limit(4);
      }
    }

    // Map to the format needed by the frontend UI
    interface RecType {
      _id?: { toString(): string };
      id?: string;
      title?: string;
      subject?: string;
      type?: string;
      fileUrl?: string;
      videoLink?: string;
      url?: string;
    }

    let formatted = recommendations.map((rec: unknown) => {
      const r = rec as RecType;
      return {
        _id: r._id?.toString() || r.id || Math.random().toString(),
        title: r.title as string,
        subject: r.subject as string,
        type: r.type as string, // PYQ, Notes, Video
        url: (r.fileUrl || r.videoLink || r.url || "#") as string,
      };
    });



    return NextResponse.json({ recommendations: formatted }, { status: 200 });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
