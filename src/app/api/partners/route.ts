import { NextRequest, NextResponse } from "next/server";

import { getPayloadClient } from "@/lib/payload";
import { parsePagination } from "@/lib/pagination";

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadClient();
    const searchParams = request.nextUrl.searchParams;
    const { page, limit } = parsePagination(searchParams);
    const type = searchParams.get("type");

    const result = await payload.find({
      collection: "partners",
      where: type ? { type: { equals: type } } : undefined,
      sort: "order",
      depth: 1,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch partners:", error);
    return NextResponse.json(
      { error: "Failed to fetch partners" },
      { status: 500 },
    );
  }
}
