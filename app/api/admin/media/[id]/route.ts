import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbUpdate, dbDelete, dbSelectOne } from "@/lib/cloudflare-db";
import { deleteFromR2, extractR2Key } from "@/lib/cloudflare-r2";

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
    const body = await request.json() as { alt?: string };
    const { alt } = body;

    await dbUpdate(
      'UPDATE media SET alt = ? WHERE id = ?',
      [alt || null, id]
    );

    const media = await dbSelectOne(
      'SELECT * FROM media WHERE id = ?',
      [id]
    );

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

    // Get media record to get the R2 key from URL
    const media = await dbSelectOne(
      'SELECT url FROM media WHERE id = ?',
      [id]
    );

    if (media) {
      // Extract R2 key from URL and delete from R2
      const key = extractR2Key(media.url);
      if (key) {
        try {
          await deleteFromR2(key);
        } catch (error) {
          console.error("Error deleting from R2:", error);
          // Continue even if R2 deletion fails
        }
      }
    }

    // Delete from database
    await dbDelete(
      'DELETE FROM media WHERE id = ?',
      [id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting media:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
