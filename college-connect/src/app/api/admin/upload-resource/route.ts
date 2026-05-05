import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Resource from "@/models/Resource";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json({ message: "Forbidden: Admins only" }, { status: 403 });
    }

    const formData = await req.formData();
    const course = formData.get("course") as string;
    const subject = formData.get("subject") as string;
    const type = formData.get("type") as string;
    const title = formData.get("title") as string;
    const videoLink = formData.get("videoLink") as string | undefined;
    let fileUrl = formData.get("fileUrl") as string | undefined;
    const yearStr = formData.get("year");
    const year = yearStr ? Number(yearStr) : undefined;
    const file = formData.get("file") as File | null;

    if (!course || !subject || !type || !title) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Handle file upload if present
    if (file && typeof file === "object" && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = `${uniqueSuffix}-${file.name.replace(/\s+/g, '-')}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (_e) {
        // Ignore if directory exists
      }

      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);
      
      fileUrl = `/uploads/${filename}`;
    }

    if (type === "Video" && !videoLink) {
      return NextResponse.json({ message: "Video link is required" }, { status: 400 });
    }
    if (type !== "Video" && !fileUrl) {
      return NextResponse.json({ message: "File URL or uploaded file is required" }, { status: 400 });
    }

    await connectToDatabase();

    const userId = (session.user as { id?: string }).id;
    const validUserId = userId && mongoose.isValidObjectId(userId) ? userId : undefined;

    const newResource = await Resource.create({
      course,
      subject,
      type,
      title,
      fileUrl,
      videoLink,
      year,
      uploadedBy: validUserId,
    });

    return NextResponse.json({ message: "Resource created successfully", resource: newResource }, { status: 201 });
  } catch (error) {
    console.error("Error creating resource:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
