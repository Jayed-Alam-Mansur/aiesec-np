import { NextRequest, NextResponse } from "next/server";

import { getPayloadClient } from "@/lib/payload";
import { parsePagination } from "@/lib/pagination";

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadClient();
    const searchParams = request.nextUrl.searchParams;
    const { page, limit } = parsePagination(searchParams);
    const lc = searchParams.get("lc");

    const result = await payload.find({
      collection: "members",
      where: {
        and: [
          { status: { equals: "active" } },
          ...(lc ? [{ "lc.slug": { equals: lc } }] : []),
        ],
      },
      sort: "fullName",
      depth: 1,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch members:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 },
    );
  }
}
