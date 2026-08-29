import type { User } from "@/domain/models";
import type { PolicyAction, UserRole } from "@/config/roles";
import { can, type PolicyResource } from "@/lib/authorization";

export class AuthorizationError extends Error {
  constructor(message = "ACCESS_DENIED") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export function assertCan(
  user: User,
  action: PolicyAction,
  resource: PolicyResource,
): void {
  if (!can(user, action, resource)) {
    throw new AuthorizationError();
  }
}

export function maskForRole<T extends object>(
  role: UserRole,
  record: T,
  sensitiveKeys: (keyof T & string)[],
): T {
  if (role === "executive" || role === "employee") {
    const clone = { ...record } as T;
    for (const key of sensitiveKeys) {
      if (key in clone && clone[key] != null) {
        (clone as Record<string, unknown>)[key] = "[REDACTED]";
      }
    }
    return clone;
  }
  return record;
}

export function shouldHideTechnicalFields(role: UserRole): boolean {
  return role === "executive" || role === "employee" || role === "plant_manager";
}
