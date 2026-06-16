import { NextRequest, NextResponse } from "next/server";

/**
 * CORS & API middleware.
 * Adds Access-Control headers to all /api/* responses and handles
 * OPTIONS preflight requests.
 */
export function middleware(request: NextRequest) {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",").map((o) =>
    o.trim(),
  ) ?? ["*"];

  const origin = request.headers.get("origin") ?? "";
  const isAllowed =
    allowedOrigins.includes("*") || allowedOrigins.includes(origin);

  // Handle preflight
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders(isAllowed ? origin : "", allowedOrigins),
    });
  }

  // Continue to the route handler
  const response = NextResponse.next();

  // Attach CORS headers to actual responses
  const headers = corsHeaders(isAllowed ? origin : "", allowedOrigins);
  headers.forEach((value, key) => {
    response.headers.set(key, value);
  });

  return response;
}

function corsHeaders(origin: string, allowedOrigins: string[]): Headers {
  const headers = new Headers();

  if (allowedOrigins.includes("*")) {
    headers.set("Access-Control-Allow-Origin", "*");
  } else if (origin) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
  }

  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  headers.set("Access-Control-Max-Age", "86400");

  return headers;
}

// Only run middleware on /api/* routes (skip /admin, static assets, etc.)
export const config = {
  matcher: "/api/:path*",
};
