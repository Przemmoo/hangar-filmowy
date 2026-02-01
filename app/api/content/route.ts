import { NextRequest, NextResponse } from "next/server";
import { getAllContent, getContentBySection } from "@/lib/cloudflare-db";

export const runtime = 'edge';
export const revalidate = 60; // Cache na 60 sekund

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    if (section) {
      // Return specific section data or empty object
      const content = await getContentBySection(section);
      const result = NextResponse.json(content?.data || {});
      result.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
      return result;
    }

    // Get all content and convert to object { section: data }
    const allContent = await getAllContent();
    const contentObject = allContent.reduce((acc: Record<string, any>, item: any) => {
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
