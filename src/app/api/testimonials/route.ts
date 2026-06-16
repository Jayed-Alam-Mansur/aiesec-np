import { NextRequest, NextResponse } from "next/server";

import { getPayloadClient } from "@/lib/payload";
import { parsePagination } from "@/lib/pagination";

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadClient();
    const searchParams = request.nextUrl.searchParams;
    const { page, limit } = parsePagination(searchParams);

    const result = await payload.find({
      collection: "testimonials",
      where: {
        isVisible: { equals: true },
      },
      sort: "-createdAt",
      depth: 1,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 },
    );
  }
}
