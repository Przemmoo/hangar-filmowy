import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdminFetch, getSupabaseAdminHeaders } from "@/lib/supabase-admin";

export const runtime = 'edge';

// GET - Fetch all content using Supabase REST API
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    let query = '/content?select=*';
    if (section) {
      query += `&section=eq.${section}`;
    }

    const response = await supabaseAdminFetch(query);

    const data = await response.json();
    return NextResponse.json(section ? (data[0] || null) : data);
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create or update content using Supabase REST API
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { section, data } = body;

    if (!section || !data) {
      return NextResponse.json({ error: "Section and data are required" }, { status: 400 });
    }

    // First, check if section exists
    const checkResponse = await supabaseAdminFetch(`/content?section=eq.${section}&select=id`);

    const existing = await checkResponse.json();
    const exists = Array.isArray(existing) && existing.length > 0;

    let response;
    if (exists) {
      // UPDATE existing record
      response = await supabaseAdminFetch(`/content?section=eq.${section}`, {
        method: 'PATCH',
        headers: {
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          data,
          updatedAt: new Date().toISOString(),
          updatedBy: session.user?.email
        })
      });
    } else {
      // INSERT new record
      const id = crypto.randomUUID();
      response = await supabaseAdminFetch(`/content`, {
        method: 'POST',
        headers: {
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          id,
          section,
          data,
          updatedAt: new Date().toISOString(),
          updatedBy: session.user?.email
        })
      });
    }

    if (!response.ok) {
      const error = await response.text();
      console.error('Supabase error:', error);
      throw new Error('Failed to save content');
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error saving content:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
