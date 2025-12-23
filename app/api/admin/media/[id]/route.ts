import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export const runtime = 'edge';

// PUT - Update media (alt text)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { alt } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const response = await fetch(`${supabaseUrl}/rest/v1/media?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseAnonKey!,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ alt })
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to update media" },
        { status: 500 }
      );
    }

    const media = await response.json();
    return NextResponse.json(media);
  } catch (error) {
    console.error("Error updating media:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete media
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // First, get the media record to get the filename from URL
    const getResponse = await fetch(`${supabaseUrl}/rest/v1/media?id=eq.${id}&select=url`, {
      headers: {
        'apikey': supabaseAnonKey!,
        'Authorization': `Bearer ${supabaseAnonKey}`,
      }
    });

    if (getResponse.ok) {
      const mediaRecords = await getResponse.json();
      if (mediaRecords.length > 0) {
        const url = mediaRecords[0].url;
        // Extract filename from URL
        const filename = url.split('/').pop();
        
        if (filename) {
          // Delete from Supabase Storage (use service role key to bypass RLS)
          await fetch(
            `${supabaseUrl}/storage/v1/object/hangar-media/${filename}`,
            {
              method: 'DELETE',
              headers: {
                'apikey': supabaseServiceKey!,
                'Authorization': `Bearer ${supabaseServiceKey}`
              }
            }
          );
        }
      }
    }

    // Delete from database
    await fetch(`${supabaseUrl}/rest/v1/media?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'apikey': supabaseAnonKey!,
        'Authorization': `Bearer ${supabaseAnonKey}`,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting media:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
