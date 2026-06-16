/**
 * Parse pagination query parameters from a request URL.
 * Defaults: page = 1, limit = 10 (capped at 100).
 */
export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10) || 10),
  );

  return { page, limit };
}
