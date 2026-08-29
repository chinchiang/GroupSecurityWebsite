import { NextRequest } from "next/server";
import { requireSession } from "@/lib/auth";
import { globalSearch } from "@/services/catalog";
import { apiError, rateLimiter } from "@/lib/security/api";
import { AuthorizationError } from "@/lib/authorization/guards";

export async function GET(request: NextRequest) {
  if (!(await rateLimiter.allow("search"))) {
    return apiError("RATE_LIMITED", "Too many requests", 429);
  }
  const q = request.nextUrl.searchParams.get("q") ?? "";
  if (q.length > 200) {
    return apiError("VALIDATION_ERROR", "Query too long", 400);
  }
  try {
    const session = await requireSession();
    const results = await globalSearch(session.user, q);
    return Response.json({ results });
  } catch (e) {
    if (e instanceof AuthorizationError) {
      return apiError("ACCESS_DENIED", "Access denied", 403);
    }
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
