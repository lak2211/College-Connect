import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Event from "@/models/Event";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const events = await Event.find({ userId: (session.user as any).id }).sort({ date: 1 });
    
    return NextResponse.json(events);
  } catch (error) {
    console.error("GET Calendar Error:", error);
    return NextResponse.json({ message: "Error fetching events" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connectToDatabase();

    const newEvent = await Event.create({
      ...body,
      userId: (session.user as any).id,
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("POST Calendar Error:", error);
    return NextResponse.json({ message: "Error creating event" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });

    await connectToDatabase();
    await Event.findOneAndDelete({ _id: id, userId: (session.user as any).id });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("DELETE Calendar Error:", error);
    return NextResponse.json({ message: "Error deleting event" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });

    await connectToDatabase();
    const updated = await Event.findOneAndUpdate(
      { _id: id, userId: (session.user as any).id },
      { $set: updates },
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH Calendar Error:", error);
    return NextResponse.json({ message: "Error updating event" }, { status: 500 });
  }
}
