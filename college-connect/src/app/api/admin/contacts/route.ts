import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Contact from "@/models/Contact";

export async function GET(_req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json({ message: "Forbidden: Admins only" }, { status: 403 });
    }

    await connectToDatabase();

    // Fetch all contacts, sort by newest first
    const contacts = await Contact.find().sort({ createdAt: -1 });

    return NextResponse.json({ contacts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
