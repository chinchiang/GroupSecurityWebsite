export const USER_ROLES = [
  "employee",
  "executive",
  "ciso",
  "security_manager",
  "grc",
  "soc_analyst",
  "incident_responder",
  "it_admin",
  "cloud_admin",
  "ot_engineer",
  "plant_manager",
  "product_security",
  "developer",
  "procurement",
  "legal_privacy",
  "auditor",
  "portal_admin",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const ROLE_LABELS: Record<UserRole, { zhTW: string; en: string }> = {
  employee: { zhTW: "一般員工", en: "Employee" },
  executive: { zhTW: "高階主管", en: "Executive" },
  ciso: { zhTW: "資安長", en: "CISO" },
  security_manager: { zhTW: "資安經理", en: "Security Manager" },
  grc: { zhTW: "GRC", en: "GRC" },
  soc_analyst: { zhTW: "SOC 分析師", en: "SOC Analyst" },
  incident_responder: { zhTW: "事件應變", en: "Incident Responder" },
  it_admin: { zhTW: "IT 管理員", en: "IT Admin" },
  cloud_admin: { zhTW: "雲端管理員", en: "Cloud Admin" },
  ot_engineer: { zhTW: "OT 工程師", en: "OT Engineer" },
  plant_manager: { zhTW: "廠長", en: "Plant Manager" },
  product_security: { zhTW: "產品資安", en: "Product Security" },
  developer: { zhTW: "開發人員", en: "Developer" },
  procurement: { zhTW: "採購", en: "Procurement" },
  legal_privacy: { zhTW: "法務／隱私", en: "Legal / Privacy" },
  auditor: { zhTW: "稽核", en: "Auditor" },
  portal_admin: { zhTW: "入口管理員", en: "Portal Admin" },
};

export const POLICY_ACTIONS = [
  "view",
  "create",
  "update",
  "approve",
  "export",
  "delete",
  "administer",
] as const;

export type PolicyAction = (typeof POLICY_ACTIONS)[number];

export const RESOURCE_TYPES = [
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
] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number];
