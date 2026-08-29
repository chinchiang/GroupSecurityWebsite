import type { DataClassification } from "@/config/site";
import type { UserRole } from "@/config/roles";
import type { AccessScope, User, UserSession } from "@/domain/models";

export interface AuthProvider {
  getSession(): Promise<UserSession | null>;
  signIn(): Promise<void>;
  signOut(): Promise<void>;
}

const FULL_SCOPE: AccessScope = {
  legalEntities: ["*"],
  businessGroups: ["*"],
  regions: ["*"],
  sites: ["*"],
  plants: ["*"],
  products: ["*"],
  dataClassifications: ["internal", "confidential", "restricted"],
};

const OT_SCOPE: AccessScope = {
  legalEntities: ["Legal Entity A"],
  businessGroups: ["Business Group A"],
  regions: ["APAC"],
  sites: ["Site Alpha"],
  plants: ["Plant A"],
  products: ["*"],
  dataClassifications: ["internal", "confidential"],
};

const EMPLOYEE_SCOPE: AccessScope = {
  legalEntities: ["Legal Entity A"],
  businessGroups: ["Business Group A"],
  regions: ["APAC"],
  sites: ["Site Alpha"],
  plants: [],
  products: [],
  dataClassifications: ["internal"],
};

const EXEC_SCOPE: AccessScope = {
  legalEntities: ["*"],
  businessGroups: ["*"],
  regions: ["*"],
  sites: ["*"],
  plants: ["*"],
  products: ["*"],
  dataClassifications: ["internal", "confidential"],
};

export const DEMO_USERS: Record<UserRole, User> = {
  employee: {
    id: "demo-user-employee",
    displayName: "Demo Employee",
    email: "demo.employee@example.invalid",
    role: "employee",
    scope: EMPLOYEE_SCOPE,
    preferredLocale: "zh-TW",
    isDemoIdentity: true,
  },
  executive: {
    id: "demo-user-executive",
    displayName: "Demo Executive",
    email: "demo.executive@example.invalid",
    role: "executive",
    scope: EXEC_SCOPE,
    preferredLocale: "zh-TW",
    isDemoIdentity: true,
  },
  ciso: {
    id: "demo-user-ciso",
    displayName: "Demo CISO",
    email: "demo.ciso@example.invalid",
    role: "ciso",
    scope: FULL_SCOPE,
    preferredLocale: "zh-TW",
    isDemoIdentity: true,
  },
  security_manager: {
    id: "demo-user-secmgr",
    displayName: "Demo Security Manager",
    email: "demo.secmgr@example.invalid",
    role: "security_manager",
    scope: FULL_SCOPE,
    preferredLocale: "zh-TW",
    isDemoIdentity: true,
  },
  grc: {
    id: "demo-user-grc",
    displayName: "Demo GRC Analyst",
    email: "demo.grc@example.invalid",
    role: "grc",
    scope: FULL_SCOPE,
    preferredLocale: "zh-TW",
    isDemoIdentity: true,
  },
  soc_analyst: {
    id: "demo-user-soc",
    displayName: "Demo SOC Analyst",
    email: "demo.soc@example.invalid",
    role: "soc_analyst",
    scope: FULL_SCOPE,
    preferredLocale: "zh-TW",
    isDemoIdentity: true,
  },
  incident_responder: {
    id: "demo-user-ir",
    displayName: "Demo Incident Responder",
    email: "demo.ir@example.invalid",
    role: "incident_responder",
    scope: FULL_SCOPE,
    preferredLocale: "zh-TW",
    isDemoIdentity: true,
  },
  it_admin: {
    id: "demo-user-it",
    displayName: "Demo IT Admin",
    email: "demo.it@example.invalid",
    role: "it_admin",
    scope: FULL_SCOPE,
    preferredLocale: "zh-TW",
    isDemoIdentity: true,
  },
  cloud_admin: {
    id: "demo-user-cloud",
    displayName: "Demo Cloud Admin",
    email: "demo.cloud@example.invalid",
    role: "cloud_admin",
    scope: FULL_SCOPE,
    preferredLocale: "zh-TW",
    isDemoIdentity: true,
  },
  ot_engineer: {
    id: "demo-user-ot",
    displayName: "Demo OT Engineer",
    email: "demo.ot@example.invalid",
    role: "ot_engineer",
    scope: OT_SCOPE,
    preferredLocale: "zh-TW",
    isDemoIdentity: true,
  },
  plant_manager: {
    id: "demo-user-plantmgr",
    displayName: "Demo Plant Manager",
    email: "demo.plantmgr@example.invalid",
    role: "plant_manager",
    scope: OT_SCOPE,
    preferredLocale: "zh-TW",
    isDemoIdentity: true,
  },
  product_security: {
    id: "demo-user-prodsec",
    displayName: "Demo Product Security",
    email: "demo.prodsec@example.invalid",
    role: "product_security",
    scope: FULL_SCOPE,
    preferredLocale: "zh-TW",
    isDemoIdentity: true,
  },
  developer: {
    id: "demo-user-dev",
    displayName: "Demo Developer",
    email: "demo.dev@example.invalid",
    role: "developer",
    scope: EMPLOYEE_SCOPE,
    preferredLocale: "zh-TW",
    isDemoIdentity: true,
  },
  procurement: {
    id: "demo-user-proc",
    displayName: "Demo Procurement",
    email: "demo.procurement@example.invalid",
    role: "procurement",
    scope: FULL_SCOPE,
    preferredLocale: "zh-TW",
    isDemoIdentity: true,
  },
  legal_privacy: {
    id: "demo-user-legal",
    displayName: "Demo Legal Privacy",
    email: "demo.legal@example.invalid",
    role: "legal_privacy",
    scope: FULL_SCOPE,
    preferredLocale: "zh-TW",
    isDemoIdentity: true,
  },
  auditor: {
    id: "demo-user-auditor",
    displayName: "Demo Auditor",
    email: "demo.auditor@example.invalid",
    role: "auditor",
    scope: FULL_SCOPE,
    preferredLocale: "zh-TW",
    isDemoIdentity: true,
  },
  portal_admin: {
    id: "demo-user-admin",
    displayName: "Demo Portal Admin",
    email: "demo.admin@example.invalid",
    role: "portal_admin",
    scope: FULL_SCOPE,
    preferredLocale: "zh-TW",
    isDemoIdentity: true,
  },
};

export function buildDemoSession(role: UserRole = "employee"): UserSession {
  const now = new Date();
  const expires = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  return {
    user: DEMO_USERS[role],
    authenticatedAt: now.toISOString(),
    provider: "mock",
    expiresAt: expires.toISOString(),
  };
}

export function classificationRank(c: DataClassification): number {
  switch (c) {
    case "restricted":
      return 3;
    case "confidential":
      return 2;
    default:
      return 1;
  }
}
