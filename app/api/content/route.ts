import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    if (section) {
      // Get specific section
      const content = await prisma.content.findUnique({
        where: { section },
        select: { data: true },
      });
      
      if (!content) {
        return NextResponse.json({}, { status: 200 });
      }

      return NextResponse.json(content.data);
    }

    // Get all sections
    const allContent = await prisma.content.findMany({
      select: { section: true, data: true },
    });

    const contentObject = allContent.reduce((acc, item) => {
      acc[item.section] = item.data;
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json(contentObject);
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json({}, { status: 200 }); // Return empty object on error
  }
}
