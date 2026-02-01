import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbSelect, dbUpdate, dbInsert, getCurrentTimestamp } from "@/lib/cloudflare-db";

export const runtime = 'edge';

// GET all settings
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await dbSelect(
      'SELECT key, value FROM settings'
    );

    const settingsObject = settings.reduce((acc: Record<string, any>, setting: { key: string; value: string }) => {
      // Try to parse JSON value, fallback to string
      try {
        acc[setting.key] = JSON.parse(setting.value);
      } catch {
        acc[setting.key] = setting.value;
      }
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
    const data = await request.json() as Record<string, any>;
    const now = getCurrentTimestamp();

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

    // Update each setting using upsert pattern
    for (const key of settingsToUpdate) {
      const value = typeof data[key] === 'object' 
        ? JSON.stringify(data[key]) 
        : (data[key] || "");
      
      // Check if exists
      const existing = await dbSelect(
        'SELECT key FROM settings WHERE key = ?',
        [key]
      );
      
      if (existing.length > 0) {
        // UPDATE
        await dbUpdate(
          'UPDATE settings SET value = ?, updatedAt = ?, updatedBy = ? WHERE key = ?',
          [value, now, session.user?.email || 'admin', key]
        );
      } else {
        // INSERT
        await dbInsert(
          'INSERT INTO settings (key, value, updatedAt, updatedBy) VALUES (?, ?, ?, ?)',
          [key, value, now, session.user?.email || 'admin']
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Error updating settings" },
      { status: 500 }
    );
  }
}
