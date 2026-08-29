import type { NextRequest } from "next/server";

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
  };
};

export function apiError(
  code: string,
  message: string,
  status: number,
): Response {
  const body: ApiErrorBody = { error: { code, message } };
  return Response.json(body, { status });
}

export function requireJsonContentType(request: NextRequest): Response | null {
  const ct = request.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) {
    return apiError("UNSUPPORTED_MEDIA_TYPE", "Content-Type must be application/json", 415);
  }
  return null;
}

/** Placeholder rate-limit interface — not backed by Redis in MVP. */
export interface RateLimiter {
  allow(key: string): Promise<boolean>;
}

export class DemoRateLimiter implements RateLimiter {
  async allow(): Promise<boolean> {
    return true;
  }
}

export const rateLimiter: RateLimiter = new DemoRateLimiter();
