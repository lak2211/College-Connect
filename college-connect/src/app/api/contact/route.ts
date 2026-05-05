import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Contact from "@/models/Contact";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    console.log("DEBUG - Received Contact Body:", body);
    const { firstName, lastName, email, subject, message } = body;

    if (!firstName || !email || !subject || !message) {
      return NextResponse.json(
        { message: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const contactData = {
      firstName,
      lastName: lastName || "",
      email,
      subject,
      message,
      status: 'unread',
      priority: 'medium',
      starred: false,
      createdAt: new Date()
    };

    const newContact = await Contact.create(contactData);

    return NextResponse.json(
      { message: "Message sent successfully!", contact: newContact },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("DEBUG - Contact API Error:", error);
    return NextResponse.json(
      { 
        message: "Internal server error", 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
