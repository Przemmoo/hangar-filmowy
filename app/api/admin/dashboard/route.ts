import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbSelect, dbSelectOne } from "@/lib/cloudflare-db";

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all submissions counts
    const allSubmissions = await dbSelect('SELECT status FROM form_submissions');
    const totalSubmissions = allSubmissions.length;
    const newSubmissions = allSubmissions.filter((s: any) => s.status === 'NEW').length;
    const inProgressSubmissions = allSubmissions.filter((s: any) => s.status === 'IN_PROGRESS').length;
    const closedSubmissions = allSubmissions.filter((s: any) => s.status === 'CLOSED').length;

    // Get total media files count
    const mediaCount = await dbSelectOne<{ count: number }>('SELECT COUNT(*) as count FROM media');
    const totalMediaFiles = mediaCount?.count || 0;

    // Get recent submissions (last 5)
    const recentSubmissions = await dbSelect(
      'SELECT id, firstName, lastName, email, status, createdAt FROM form_submissions ORDER BY createdAt DESC LIMIT 5'
    );

    return NextResponse.json({
      totalSubmissions,
      newSubmissions,
      inProgressSubmissions,
      closedSubmissions,
      totalMediaFiles,
      recentSubmissions,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Error fetching dashboard stats" },
      { status: 500 }
    );
  }
}
