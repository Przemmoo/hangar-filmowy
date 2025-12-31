import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdminFetch } from "@/lib/supabase-admin";

export const runtime = 'edge';

// GET - Fetch all submissions
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const response = await supabaseAdminFetch('/form_submissions?select=*&order=createdAt.desc');

    const submissions = await response.json();
    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
