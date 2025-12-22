import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

// GET - Fetch all content or specific section
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    if (section) {
      const content = await prisma.content.findUnique({
        where: { section },
      });
      return NextResponse.json(content);
    }

    const allContent = await prisma.content.findMany();
    return NextResponse.json(allContent);
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create or update content section
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { section, data } = body;

    if (!section || !data) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const content = await prisma.content.upsert({
      where: { section },
      update: {
        data,
        updatedBy: session.user?.email || "admin",
      },
      create: {
        section,
        data,
        updatedBy: session.user?.email || "admin",
      },
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error("Error saving content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
