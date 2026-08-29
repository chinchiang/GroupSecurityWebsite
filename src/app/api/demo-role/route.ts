import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { USER_ROLES, type UserRole } from "@/config/roles";
import { DEMO_ROLE_COOKIE } from "@/lib/auth";
import { apiError, requireJsonContentType, rateLimiter } from "@/lib/security/api";
import { mockAuditRepository } from "@/adapters/mock/repositories";

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return apiError("FORBIDDEN", "Role switcher disabled in production", 403);
  }
  const ct = requireJsonContentType(request);
  if (ct) return ct;
  if (!(await rateLimiter.allow("demo-role"))) {
    return apiError("RATE_LIMITED", "Too many requests", 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("BAD_REQUEST", "Invalid JSON", 400);
  }

  const role = (body as { role?: string })?.role;
  if (!role || !(USER_ROLES as readonly string[]).includes(role)) {
    return apiError("VALIDATION_ERROR", "Invalid role", 400);
  }

  await mockAuditRepository.append({
    action: "role_change",
    actorId: "demo-switcher",
    actorRole: role as UserRole,
    resourceType: "session",
    summary: `Demo role switched to ${role}`,
    classification: "internal",
    timestamp: new Date().toISOString(),
    outcome: "success",
  });

  const jar = await cookies();
  jar.set(DEMO_ROLE_COOKIE, role, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 28800,
  });

  return Response.json({ ok: true, role });
}
