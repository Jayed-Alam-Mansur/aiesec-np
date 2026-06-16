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
      collection: "posts",
      where: {
        and: [{ slug: { equals: slug } }, { published: { equals: true } }],
      },
      limit: 1,
      depth: 1,
    });

    const post = result.docs[0];

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}
