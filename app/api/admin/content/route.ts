import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbSelect, dbSelectOne, dbInsert, dbUpdate, parseJSON, stringifyJSON, getCurrentTimestamp } from "@/lib/cloudflare-db";

export const runtime = 'edge';

// GET - Fetch all content
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    if (section) {
      const content = await dbSelectOne(
        'SELECT * FROM content WHERE section = ?',
        [section]
      );
      
      if (content) {
        return NextResponse.json({
          ...content,
          data: parseJSON(content.data),
        });
      }
      return NextResponse.json(null);
    }

    const allContent = await dbSelect('SELECT * FROM content');
    const parsedContent = allContent.map((c: any) => ({
      ...c,
      data: parseJSON(c.data),
    }));
    
    return NextResponse.json(parsedContent);
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create or update content
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

    const now = getCurrentTimestamp();
    
    // Check if section exists
    const existing = await dbSelectOne(
      'SELECT id FROM content WHERE section = ?',
      [section]
    );

    if (existing) {
      // UPDATE existing record
      await dbUpdate(
        'UPDATE content SET data = ?, updatedAt = ?, updatedBy = ? WHERE section = ?',
        [stringifyJSON(data), now, session.user?.email || 'admin', section]
      );
    } else {
      // INSERT new record
      const id = crypto.randomUUID();
      await dbInsert(
        'INSERT INTO content (id, section, data, updatedAt, updatedBy) VALUES (?, ?, ?, ?, ?)',
        [id, section, stringifyJSON(data), now, session.user?.email || 'admin']
      );
    }

    // Return updated content
    const result = await dbSelectOne(
      'SELECT * FROM content WHERE section = ?',
      [section]
    );

    return NextResponse.json({
      ...result,
      data: parseJSON(result?.data),
    });
  } catch (error) {
    console.error("Error saving content:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
