import { NextResponse } from "next/server";

import { isGoogleSheetsConfigured } from "@/lib/google-sheets";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: "ok",
      database: "connected",
      googleSheets: isGoogleSheetsConfigured() ? "configured" : "not_configured",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        status: "degraded",
        database: "disconnected",
        googleSheets: isGoogleSheetsConfigured() ? "configured" : "not_configured",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
