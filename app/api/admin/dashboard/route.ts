import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdminFetch } from "@/lib/supabase-admin";

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all submissions counts
    const submissionsRes = await supabaseAdminFetch('/form_submissions?select=status');
    const allSubmissions = await submissionsRes.json();
    const totalSubmissions = allSubmissions.length;
    const newSubmissions = allSubmissions.filter((s: any) => s.status === 'NEW').length;
    const inProgressSubmissions = allSubmissions.filter((s: any) => s.status === 'IN_PROGRESS').length;
    const closedSubmissions = allSubmissions.filter((s: any) => s.status === 'CLOSED').length;

    // Get total media files count
    const mediaRes = await supabaseAdminFetch('/media?select=id');
    const mediaFiles = await mediaRes.json();
    const totalMediaFiles = mediaFiles.length;

    // Get recent submissions (last 5)
    const recentRes = await supabaseAdminFetch('/form_submissions?select=id,firstName,lastName,email,status,createdAt&order=createdAt.desc&limit=5');
    const recentSubmissions = await recentRes.json();

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
