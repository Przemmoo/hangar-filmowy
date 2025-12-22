import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get submission counts by status
    const totalSubmissions = await prisma.formSubmission.count();
    const newSubmissions = await prisma.formSubmission.count({
      where: { status: "NEW" },
    });
    const inProgressSubmissions = await prisma.formSubmission.count({
      where: { status: "IN_PROGRESS" },
    });
    const closedSubmissions = await prisma.formSubmission.count({
      where: { status: "CLOSED" },
    });

    // Get total media files
    const totalMediaFiles = await prisma.media.count();

    // Get recent submissions (last 5)
    const recentSubmissions = await prisma.formSubmission.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      totalSubmissions,
      newSubmissions,
      inProgressSubmissions,
      closedSubmissions,
      totalMediaFiles,
      recentSubmissions,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Error fetching dashboard stats" },
      { status: 500 }
    );
  }
}
