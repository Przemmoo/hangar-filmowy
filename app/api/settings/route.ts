import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const settings = await prisma.setting.findMany();
    const settingsObject = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json(settingsObject);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({}, { status: 200 }); // Return empty object on error
  }
}
