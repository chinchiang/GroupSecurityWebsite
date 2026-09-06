import { cookies } from "next/headers";
import type { UserRole } from "@/config/roles";
import { USER_ROLES } from "@/config/roles";
import type { AuthProvider } from "@/lib/auth/types";
import { buildDemoSession } from "@/lib/auth/types";
import type { UserSession } from "@/domain/models";

export const DEMO_ROLE_COOKIE = "demo_role";

function isUserRole(value: string): value is UserRole {
  return (USER_ROLES as readonly string[]).includes(value);
}

export class MockAuthProvider implements AuthProvider {
  async getSession(): Promise<UserSession | null> {
    if (process.env.NODE_ENV === "production" && process.env.AUTH_PROVIDER !== "mock") {
      return null;
    }
    const envRole = process.env.DEMO_DEFAULT_ROLE;
    const fallbackRole: UserRole =
      envRole && isUserRole(envRole) ? envRole : "employee";

    // The demo_role cookie is unsigned, so it is only ever honoured in
    // development. A production demo build (AUTH_PROVIDER=mock) pins every
    // visitor to DEMO_DEFAULT_ROLE; otherwise anyone could forge the cookie
    // and grant themselves Portal Admin.
    if (process.env.NODE_ENV === "production") {
      return buildDemoSession(fallbackRole);
    }

    const jar = await cookies();
    const roleCookie = jar.get(DEMO_ROLE_COOKIE)?.value;
    const role =
      roleCookie && isUserRole(roleCookie) ? roleCookie : fallbackRole;
    return buildDemoSession(role);
  }

  async signIn(): Promise<void> {
    // Demo: session is cookie-based role selection; no password flow.
  }

  async signOut(): Promise<void> {
    const jar = await cookies();
    jar.delete(DEMO_ROLE_COOKIE);
  }
}

export function getAuthProvider(): AuthProvider {
  const provider = process.env.AUTH_PROVIDER ?? "mock";
  if (provider === "mock") {
    return new MockAuthProvider();
  }
  // Formal OIDC/SAML providers are not implemented in this MVP.
  return new MockAuthProvider();
}

export async function requireSession(): Promise<UserSession> {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.AUTH_PROVIDER &&
    process.env.AUTH_PROVIDER !== "mock" &&
    !process.env.OIDC_ISSUER
  ) {
    throw new Error("AUTH_CONFIGURATION_ERROR");
  }

  const session = await getAuthProvider().getSession();
  if (!session) {
    throw new Error("AUTH_CONFIGURATION_ERROR");
  }
  return session;
}
