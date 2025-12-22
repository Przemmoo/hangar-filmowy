import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const runtime = 'edge';

// GET all settings
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all settings and convert to object
    const settings = await prisma.setting.findMany();
    const settingsObject = settings.reduce((acc: Record<string, string>, setting: { key: string; value: string }) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

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

    await Promise.all(
      settingsToUpdate.map((key) =>
        prisma.setting.upsert({
          where: { key },
          update: { value: data[key] || "" },
          create: { key, value: data[key] || "" },
        })
      )
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
