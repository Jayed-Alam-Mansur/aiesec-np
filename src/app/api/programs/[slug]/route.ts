import { NextResponse } from "next/server";

import { getPayloadClient } from "@/lib/payload";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const payload = await getPayloadClient();

    const result = await payload.find({
      collection: "programs",
      where: {
        slug: { equals: slug },
      },
      limit: 1,
      depth: 1,
    });

    const program = result.docs[0];

    if (!program) {
      return NextResponse.json(
        { error: "Program not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(program);
  } catch (error) {
    console.error("Failed to fetch program:", error);
    return NextResponse.json(
      { error: "Failed to fetch program" },
      { status: 500 },
    );
  }
}
