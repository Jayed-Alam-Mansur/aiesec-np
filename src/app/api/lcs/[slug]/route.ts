import { NextResponse } from "next/server";

import { getPayloadClient } from "@/lib/payload";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const payload = await getPayloadClient();

    // Fetch the LC
    const lcResult = await payload.find({
      collection: "local-committees",
      where: {
        slug: { equals: slug },
      },
      limit: 1,
      depth: 1,
    });

    const lc = lcResult.docs[0];

    if (!lc) {
      return NextResponse.json(
        { error: "Local committee not found" },
        { status: 404 },
      );
    }

    // Fetch members belonging to this LC
    const members = await payload.find({
      collection: "members",
      where: {
        and: [
          { lc: { equals: lc.id } },
          { status: { equals: "active" } },
        ],
      },
      sort: "fullName",
      depth: 1,
      limit: 100,
    });

    return NextResponse.json({
      ...lc,
      members: members.docs,
    });
  } catch (error) {
    console.error("Failed to fetch local committee:", error);
    return NextResponse.json(
      { error: "Failed to fetch local committee" },
      { status: 500 },
    );
  }
}
