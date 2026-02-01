import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbSelect, dbInsert, getCurrentTimestamp } from "@/lib/cloudflare-db";
import { uploadToR2, validateImageFile } from "@/lib/cloudflare-r2";

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

    const media = await dbSelect(
      'SELECT * FROM media ORDER BY createdAt DESC'
    );

    return NextResponse.json(media);
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Upload media to R2
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Upload to R2
    const { key, url } = await uploadToR2(file);

    // Save metadata to database
    const mediaId = crypto.randomUUID();
    const now = getCurrentTimestamp();
    
    await dbInsert(
      `INSERT INTO media (
        id, filename, url, size, mimeType, uploadedBy, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        mediaId,
        file.name,
        url,
        file.size,
        file.type,
        session.user?.email || "admin",
        now
      ]
    );

    // Return created media
    const media = {
      id: mediaId,
      filename: file.name,
      url,
      size: file.size,
      mimeType: file.type,
      uploadedBy: session.user?.email || "admin",
      createdAt: now
    };

    return NextResponse.json(media);
  } catch (error) {
    console.error("Error uploading media:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
