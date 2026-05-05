import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Resource from "@/models/Resource";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const subject = searchParams.get("subject");

    await connectToDatabase();

    const query: Record<string, string> = {};
    if (type) query.type = type;
    if (subject && subject !== "All") query.subject = subject;

    const resources = await Resource.find(query).sort({ createdAt: -1 });

    return NextResponse.json(resources, { status: 200 });
  } catch (error) {
    console.error("Error fetching resources:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
