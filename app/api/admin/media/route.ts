import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdminFetch } from "@/lib/supabase-admin";

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

    const response = await supabaseAdminFetch('/media?select=*&order=createdAt.desc');

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

// POST - Upload media to Supabase Storage
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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const uniqueFilename = `${crypto.randomUUID()}.${fileExt}`;
    
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage (use service role key to bypass RLS)
    const uploadResponse = await fetch(
      `${supabaseUrl}/storage/v1/object/hangar-media/${uniqueFilename}`,
      {
        method: 'POST',
        headers: {
          'apikey': supabaseServiceKey!,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': file.type,
          'x-upsert': 'false'
        },
        body: buffer
      }
    );

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      console.error('Supabase Storage error:', {
        status: uploadResponse.status,
        statusText: uploadResponse.statusText,
        error: error,
        url: `${supabaseUrl}/storage/v1/object/hangar-media/${uniqueFilename}`,
        bucket: 'hangar-media',
        filename: uniqueFilename
      });
      return NextResponse.json(
        { 
          error: "Failed to upload file to storage",
          details: error,
          status: uploadResponse.status
        },
        { status: 500 }
      );
    }

    // Get public URL
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/hangar-media/${uniqueFilename}`;

    // Note: Image dimensions cannot be extracted in Edge Runtime
    // They would need to be processed client-side or in a Node.js runtime

    // Save metadata to database
    const mediaData = {
      id: crypto.randomUUID(),
      filename: file.name,
      url: publicUrl,
      size: file.size,
      mimeType: file.type,
      uploadedBy: session.user?.email || "admin",
      createdAt: new Date().toISOString()
    };

    const dbResponse = await supabaseAdminFetch(`/media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(mediaData)
    });

    if (!dbResponse.ok) {
      // If database save fails, try to delete uploaded file
      await fetch(
        `${supabaseUrl}/storage/v1/object/hangar-media/${uniqueFilename}`,
        {
          method: 'DELETE',
          headers: {
            'apikey': supabaseServiceKey!,
            'Authorization': `Bearer ${supabaseServiceKey}`
          }
        }
      );
      
      return NextResponse.json(
        { error: "Failed to save media metadata" },
        { status: 500 }
      );
    }

    const media = await dbResponse.json();
    return NextResponse.json(media);
  } catch (error) {
    console.error("Error uploading media:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
