import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbSelect, parseJSON } from "@/lib/cloudflare-db";

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

    const submissions = await dbSelect(
      'SELECT * FROM form_submissions ORDER BY createdAt DESC'
    );

    // Parse JSON columns
    const parsedSubmissions = submissions.map((s: any) => ({
      ...s,
      extras: parseJSON(s.extras),
    }));

    return NextResponse.json(parsedSubmissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
