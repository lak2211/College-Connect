import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Todo from "@/models/Todo";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const todos = await Todo.find({ userId: (session.user as any).id }).sort({ createdAt: -1 });
    
    return NextResponse.json(todos);
  } catch (error) {
    console.error("GET Todo Error:", error);
    return NextResponse.json({ message: "Error fetching tasks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connectToDatabase();

    const newTodo = await Todo.create({
      ...body,
      userId: (session.user as any).id,
    });

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    console.error("POST Todo Error:", error);
    return NextResponse.json({ message: "Error creating task" }, { status: 500 });
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
    await Todo.findOneAndDelete({ _id: id, userId: (session.user as any).id });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("DELETE Todo Error:", error);
    return NextResponse.json({ message: "Error deleting task" }, { status: 500 });
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
    const updated = await Todo.findOneAndUpdate(
      { _id: id, userId: (session.user as any).id },
      { $set: updates },
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH Todo Error:", error);
    return NextResponse.json({ message: "Error updating task" }, { status: 500 });
  }
}
