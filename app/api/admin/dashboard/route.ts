import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Get all submissions counts
    const submissionsRes = await fetch(`${supabaseUrl}/rest/v1/form_submissions?select=status`, {
      headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
    });
    const allSubmissions = await submissionsRes.json();
    const totalSubmissions = allSubmissions.length;
    const newSubmissions = allSubmissions.filter((s: any) => s.status === 'NEW').length;
    const inProgressSubmissions = allSubmissions.filter((s: any) => s.status === 'IN_PROGRESS').length;
    const closedSubmissions = allSubmissions.filter((s: any) => s.status === 'CLOSED').length;

    // Get total media files count
    const mediaRes = await fetch(`${supabaseUrl}/rest/v1/media?select=id`, {
      headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
    });
    const mediaFiles = await mediaRes.json();
    const totalMediaFiles = mediaFiles.length;

    // Get recent submissions (last 5)
    const recentRes = await fetch(`${supabaseUrl}/rest/v1/form_submissions?select=id,firstName,lastName,email,status,createdAt&order=createdAt.desc&limit=5`, {
      headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
    });
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
