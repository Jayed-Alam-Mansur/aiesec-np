import { NextResponse } from "next/server";

import { getPayloadClient } from "@/lib/payload";

export async function GET() {
  try {
    const payload = await getPayloadClient();

    const result = await payload.find({
      collection: "local-committees",
      sort: "order",
      depth: 1,
      limit: 50,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch local committees:", error);
    return NextResponse.json(
      { error: "Failed to fetch local committees" },
      { status: 500 },
    );
  }
}
