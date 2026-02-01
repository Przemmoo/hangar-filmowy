import { NextRequest, NextResponse } from "next/server";
import { getAllSettings } from "@/lib/cloudflare-db";

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const settings = await getAllSettings();
    
    const settingsObject = settings.reduce((acc: any, setting: any) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});

    return NextResponse.json(settingsObject);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({}, { status: 200 }); // Return empty object on error
  }
}
