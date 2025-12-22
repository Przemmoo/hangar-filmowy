import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const response = await fetch(`${supabaseUrl}/rest/v1/media?select=*&order=createdAt.desc`, {
      headers: {
        'apikey': supabaseKey!,
        'Authorization': `Bearer ${supabaseKey}`,
      }
    });

    const media = await response.json();
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
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const mediaData = {
      id: crypto.randomUUID(),
      filename: file.name,
      url: `/uploads/${file.name}`, // Placeholder URL
      size: file.size,
      mimeType: file.type,
      uploadedBy: session.user?.email || "admin",
      createdAt: new Date().toISOString()
    };

    const response = await fetch(`${supabaseUrl}/rest/v1/media`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey!,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(mediaData)
    });

    const media = await response.json();
    return NextResponse.json(media);
  } catch (error) {
    console.error("Error uploading media:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
