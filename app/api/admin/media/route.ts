import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const runtime = 'edge';

// GET - Fetch all media
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const media = await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Upload media (placeholder - needs actual file upload implementation)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // TODO: Implement actual file upload to Cloudflare R2
    // For now, return a placeholder response
    
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Placeholder: In production, upload to Cloudflare R2 and get URL
    const media = await prisma.media.create({
      data: {
        filename: file.name,
        url: `/uploads/${file.name}`, // Placeholder URL
        size: file.size,
        mimeType: file.type,
        uploadedBy: session.user?.email || "admin",
      },
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error("Error uploading media:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
