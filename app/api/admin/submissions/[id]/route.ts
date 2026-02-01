import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbUpdate, dbDelete, dbSelectOne, getCurrentTimestamp } from "@/lib/cloudflare-db";

export const runtime = 'edge';

// PATCH - Update submission status
export async function PATCH(
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
    const body = await request.json() as { status?: string };
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    const now = getCurrentTimestamp();
    
    await dbUpdate(
      'UPDATE form_submissions SET status = ?, updatedAt = ? WHERE id = ?',
      [status, now, id]
    );

    const submission = await dbSelectOne(
      'SELECT * FROM form_submissions WHERE id = ?',
      [id]
    );

    return NextResponse.json(submission);
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete submission
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

    // Delete submission and related replies (cascade)
    await dbDelete(
      'DELETE FROM submission_replies WHERE submissionId = ?',
      [id]
    );
    
    await dbDelete(
      'DELETE FROM form_submissions WHERE id = ?',
      [id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
