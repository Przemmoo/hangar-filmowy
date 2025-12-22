import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let url = `${supabaseUrl}/rest/v1/content?select=section,data`;
    if (section) {
      url += `&section=eq.${section}`;
    }

    const response = await fetch(url, {
      headers: {
        'apikey': supabaseKey!,
        'Authorization': `Bearer ${supabaseKey}`,
      }
    });

    if (!response.ok) {
      return NextResponse.json({}, { status: 200 });
    }

    const data = await response.json();

    if (section) {
      // Return specific section data or empty object
      return NextResponse.json(data[0]?.data || {});
    }

    // Convert array to object { section: data }
    const contentObject = data.reduce((acc: Record<string, any>, item: any) => {
      acc[item.section] = item.data;
      return acc;
    }, {});

    return NextResponse.json(contentObject);
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json({}, { status: 200 }); // Return empty object on error
  }
}
