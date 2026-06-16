import { NextRequest, NextResponse } from "next/server";

import { getPayloadClient } from "@/lib/payload";
import { parsePagination } from "@/lib/pagination";

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadClient();
    const searchParams = request.nextUrl.searchParams;
    const { page, limit } = parsePagination(searchParams);
    const category = searchParams.get("category");

    const result = await payload.find({
      collection: "posts",
      where: {
        and: [
          { published: { equals: true } },
          ...(category ? [{ category: { equals: category } }] : []),
        ],
      },
      sort: "-publishedAt",
      depth: 1,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}
