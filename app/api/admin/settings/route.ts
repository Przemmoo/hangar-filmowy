import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// GET all settings
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const response = await fetch(`${supabaseUrl}/rest/v1/settings?select=key,value`, {
      headers: {
        'apikey': supabaseKey!,
        'Authorization': `Bearer ${supabaseKey}`,
      }
    });

    const settings = await response.json();
    const settingsObject = settings.reduce((acc: Record<string, any>, setting: { key: string; value: any }) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});

    // Return with default values if not set
    return NextResponse.json({
      contactEmail: settingsObject.contactEmail || "",
      contactPhone: settingsObject.contactPhone || "",
      contactAddress: settingsObject.contactAddress || "",
      facebookUrl: settingsObject.facebookUrl || "",
      instagramUrl: settingsObject.instagramUrl || "",
      youtubeUrl: settingsObject.youtubeUrl || "",
      linkedinUrl: settingsObject.linkedinUrl || "",
      seoTitle: settingsObject.seoTitle || "",
      seoDescription: settingsObject.seoDescription || "",
      seoKeywords: settingsObject.seoKeywords || "",
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Error fetching settings" },
      { status: 500 }
    );
  }
}

// POST (update) settings
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    // Update each setting individually
    const settingsToUpdate = [
      "contactEmail",
      "contactPhone",
      "contactAddress",
      "facebookUrl",
      "instagramUrl",
      "youtubeUrl",
      "linkedinUrl",
      "seoTitle",
      "seoDescription",
      "seoKeywords",
    ];

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Update each setting using upsert pattern
    await Promise.all(
      settingsToUpdate.map(async (key) => {
        const value = typeof data[key] === 'object' ? data[key] : (data[key] || "");
        
        // Check if exists
        const checkRes = await fetch(`${supabaseUrl}/rest/v1/settings?key=eq.${key}&select=key`, {
          headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
        });
        const existing = await checkRes.json();
        
        if (existing.length > 0) {
          // UPDATE
          return fetch(`${supabaseUrl}/rest/v1/settings?key=eq.${key}`, {
            method: 'PATCH',
            headers: {
              'apikey': supabaseKey!,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ value, updatedAt: new Date().toISOString(), updatedBy: session.user?.email })
          });
        } else {
          // INSERT
          return fetch(`${supabaseUrl}/rest/v1/settings`, {
            method: 'POST',
            headers: {
              'apikey': supabaseKey!,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key, value, updatedAt: new Date().toISOString(), updatedBy: session.user?.email })
          });
        }
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Error updating settings" },
      { status: 500 }
    );
  }
}
