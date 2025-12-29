import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';
export const revalidate = 60; // Cache na 60 sekund

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
      },
      next: { revalidate: 60 } // Cache Supabase fetch
    });

    if (!response.ok) {
      return NextResponse.json({}, { status: 200 });
    }

    const data = await response.json();

    if (section) {
      // Return specific section data or empty object
      const result = NextResponse.json(data[0]?.data || {});
      result.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
      return result;
    }

    // Convert array to object { section: data }
    const contentObject = data.reduce((acc: Record<string, any>, item: any) => {
      acc[item.section] = item.data;
      return acc;
    }, {});

    const result = NextResponse.json(contentObject);
    result.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return result;
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json({}, { status: 200 }); // Return empty object on error
  }
}
