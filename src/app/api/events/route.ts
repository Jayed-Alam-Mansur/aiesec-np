import { NextRequest, NextResponse } from "next/server";

import { getPayloadClient } from "@/lib/payload";
import { parsePagination } from "@/lib/pagination";

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadClient();
    const searchParams = request.nextUrl.searchParams;
    const { page, limit } = parsePagination(searchParams);
    const upcoming = searchParams.get("upcoming");

    const result = await payload.find({
      collection: "events",
      where: {
        and: [
          { published: { equals: true } },
          ...(upcoming === "true" ? [{ isUpcoming: { equals: true } }] : []),
          ...(upcoming === "false" ? [{ isUpcoming: { equals: false } }] : []),
        ],
      },
      sort: "-eventDate",
      depth: 1,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}
