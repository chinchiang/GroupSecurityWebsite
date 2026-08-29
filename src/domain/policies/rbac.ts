import type {
  PolicyAction,
  ResourceType,
  UserRole,
} from "@/config/roles";
import type { DataClassification } from "@/config/site";
import type { AccessScope, User } from "@/domain/models";

export type PolicyResource = {
  type: ResourceType;
  classification?: DataClassification;
  legalEntity?: string;
  businessGroup?: string;
  region?: string;
  site?: string;
  plant?: string;
  product?: string;
  ownerId?: string;
};

const ALL: PolicyAction[] = [
  "view",
  "create",
  "update",
  "approve",
  "export",
  "delete",
  "administer",
];

const READ = ["view"] as PolicyAction[];
const READ_EXPORT = ["view", "export"] as PolicyAction[];
const OPERATE = ["view", "create", "update", "export"] as PolicyAction[];
const APPROVE_SET = [
  "view",
  "create",
  "update",
  "approve",
  "export",
] as PolicyAction[];

/** Baseline RBAC matrix — demo only, not enterprise IAM. */
const ROLE_PERMISSIONS: Record<UserRole, Partial<Record<ResourceType, PolicyAction[]>>> = {
  employee: {
    dashboard: READ,
    service_request: ["view", "create"],
    knowledge: READ,
    training: READ,
    incident: ["view", "create"],
  },
  executive: {
    dashboard: READ,
    risk: READ,
    metric: READ,
    incident: READ,
    plant: READ,
    supplier: READ,
    compliance: READ,
    knowledge: READ,
  },
  ciso: {
    dashboard: ALL,
    risk: APPROVE_SET,
    control: APPROVE_SET,
    compliance: APPROVE_SET,
    policy: APPROVE_SET,
    audit: READ_EXPORT,
    metric: READ_EXPORT,
    incident: APPROVE_SET,
    regulatory_clock: APPROVE_SET,
    asset: READ_EXPORT,
    vulnerability: READ_EXPORT,
    plant: READ_EXPORT,
    ot: READ_EXPORT,
    product_security: READ_EXPORT,
    supplier: READ_EXPORT,
    knowledge: APPROVE_SET,
    service_request: APPROVE_SET,
    audit_trail: READ_EXPORT,
    admin: ["view"],
  },
  security_manager: {
    dashboard: READ,
    risk: OPERATE,
    control: OPERATE,
    compliance: OPERATE,
    policy: OPERATE,
    incident: OPERATE,
    regulatory_clock: OPERATE,
    asset: READ_EXPORT,
    vulnerability: OPERATE,
    plant: READ,
    supplier: OPERATE,
    service_request: APPROVE_SET,
    knowledge: OPERATE,
    audit_trail: READ,
    metric: READ,
  },
  grc: {
    dashboard: READ,
    risk: APPROVE_SET,
    control: APPROVE_SET,
    compliance: APPROVE_SET,
    policy: APPROVE_SET,
    audit: APPROVE_SET,
    metric: READ_EXPORT,
    knowledge: OPERATE,
    audit_trail: READ_EXPORT,
  },
  soc_analyst: {
    dashboard: READ,
    incident: OPERATE,
    threat_intel: OPERATE,
    detection: OPERATE,
    playbook: READ,
    regulatory_clock: READ,
    asset: READ,
    vulnerability: READ,
  },
  incident_responder: {
    dashboard: READ,
    incident: OPERATE,
    playbook: READ,
    regulatory_clock: OPERATE,
    asset: READ,
  },
  it_admin: {
    dashboard: READ,
    asset: OPERATE,
    vulnerability: OPERATE,
    identity: OPERATE,
    service_request: ["view", "create", "update"],
  },
  cloud_admin: {
    dashboard: READ,
    cloud: OPERATE,
    asset: READ,
    vulnerability: OPERATE,
    data_protection: READ,
  },
  ot_engineer: {
    dashboard: READ,
    plant: READ,
    ot: OPERATE,
    asset: READ,
    vulnerability: READ,
    incident: ["view", "create"],
  },
  plant_manager: {
    dashboard: READ,
    plant: READ,
    risk: READ,
    incident: READ,
    ot: READ,
  },
  product_security: {
    dashboard: READ,
    product_security: OPERATE,
    vulnerability: OPERATE,
    knowledge: OPERATE,
    ai_security: OPERATE,
    devsecops: OPERATE,
  },
  developer: {
    dashboard: READ,
    devsecops: READ,
    product_security: READ,
    knowledge: READ,
    service_request: ["view", "create"],
  },
  procurement: {
    dashboard: READ,
    supplier: OPERATE,
    service_request: ["view", "create"],
    knowledge: READ,
  },
  legal_privacy: {
    dashboard: READ,
    compliance: OPERATE,
    regulatory_clock: APPROVE_SET,
    policy: READ,
    audit_trail: READ,
    data_protection: READ,
  },
  auditor: {
    dashboard: READ,
    risk: READ_EXPORT,
    control: READ_EXPORT,
    compliance: READ_EXPORT,
    policy: READ_EXPORT,
    audit: READ_EXPORT,
    incident: READ_EXPORT,
    asset: READ_EXPORT,
    plant: READ_EXPORT,
    supplier: READ_EXPORT,
    knowledge: READ_EXPORT,
    audit_trail: READ_EXPORT,
    metric: READ_EXPORT,
  },
  portal_admin: Object.fromEntries(
    (
      [
        "dashboard",
        "risk",
        "control",
        "compliance",
        "policy",
        "audit",
        "metric",
        "incident",
        "threat_intel",
        "detection",
        "playbook",
        "regulatory_clock",
        "asset",
        "vulnerability",
        "identity",
        "cloud",
        "data_protection",
        "plant",
        "ot",
        "product_security",
        "devsecops",
        "ai_security",
        "supplier",
        "resilience",
        "training",
        "service_request",
        "knowledge",
        "admin",
        "audit_trail",
      ] as ResourceType[]
    ).map((r) => [r, ALL]),
  ) as Partial<Record<ResourceType, PolicyAction[]>>,
};

function scopeAllows(scope: AccessScope, resource: PolicyResource): boolean {
  const checks: Array<[string[] | undefined, string | undefined]> = [
    [scope.legalEntities, resource.legalEntity],
    [scope.businessGroups, resource.businessGroup],
    [scope.regions, resource.region],
    [scope.sites, resource.site],
    [scope.plants, resource.plant],
    [scope.products, resource.product],
  ];

  for (const [allowed, value] of checks) {
    if (!value) continue;
    if (!allowed || allowed.length === 0) continue;
    if (allowed.includes("*")) continue;
    if (!allowed.includes(value)) return false;
  }

  if (resource.classification) {
    if (
      scope.dataClassifications.length > 0 &&
      !scope.dataClassifications.includes(resource.classification)
    ) {
      return false;
    }
  }

  return true;
}

export function can(
  user: User,
  action: PolicyAction,
  resource: PolicyResource,
): boolean {
  const allowed = ROLE_PERMISSIONS[user.role]?.[resource.type] ?? [];
  if (!allowed.includes(action)) return false;
  if (resource.type === "admin" && action === "administer") {
    return user.role === "portal_admin";
  }
  return scopeAllows(user.scope, resource);
}

export function filterByScope<T extends PolicyResource>(
  user: User,
  items: T[],
): T[] {
  return items.filter((item) => can(user, "view", item));
}

export function canAccessClassification(
  user: User,
  classification: DataClassification,
): boolean {
  return (
    user.scope.dataClassifications.length === 0 ||
    user.scope.dataClassifications.includes(classification)
  );
}

export function isMutatingRole(role: UserRole): boolean {
  return role !== "auditor" && role !== "executive";
}
