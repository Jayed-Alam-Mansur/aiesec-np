import { NextResponse } from "next/server";

import { getPayloadClient } from "@/lib/payload";

export async function GET() {
  try {
    const payload = await getPayloadClient();

    const result = await payload.find({
      collection: "programs",
      sort: "order",
      depth: 1,
      limit: 50,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch programs:", error);
    return NextResponse.json(
      { error: "Failed to fetch programs" },
      { status: 500 },
    );
  }
}
