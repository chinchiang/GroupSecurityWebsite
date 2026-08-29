import type { ResourceType } from "@/config/roles";
import type { User } from "@/domain/models";
import { can } from "@/lib/authorization";
import {
  mockAssetRepository,
  mockAuditRepository,
  mockClockRepository,
  mockIncidentRepository,
  mockKnowledgeRepository,
  mockPlantRepository,
  mockRiskRepository,
  mockServiceRequestRepository,
  mockSupplierRepository,
  mockVulnerabilityRepository,
} from "@/adapters/mock/repositories";
import {
  assertCan,
  maskForRole,
  shouldHideTechnicalFields,
} from "@/lib/authorization/guards";
import { mockActionItems, mockMetrics, mockProducts } from "@/data/mock/fixtures";

function toPolicyResource(
  type: ResourceType,
  item: {
    classification?: "internal" | "confidential" | "restricted";
    legalEntity?: string;
    businessGroup?: string;
    region?: string;
    site?: string;
    plant?: string;
    product?: string;
  },
) {
  return {
    type,
    classification: item.classification,
    legalEntity: item.legalEntity,
    businessGroup: item.businessGroup,
    region: item.region,
    site: item.site,
    plant: item.plant,
    product: item.product,
  };
}

export async function listRisks(user: User, search?: string) {
  assertCan(user, "view", { type: "risk" });
  const items = await mockRiskRepository.list({ search });
  return items.filter((item) => can(user, "view", toPolicyResource("risk", item)));
}

export async function getRisk(user: User, id: string) {
  const item = await mockRiskRepository.getById(id);
  if (!item) return null;
  assertCan(user, "view", toPolicyResource("risk", item));
  await mockAuditRepository.append({
    action: "detail_view",
    actorId: user.id,
    actorRole: user.role,
    resourceType: "risk",
    resourceId: id,
    summary: `Viewed risk ${id}`,
    classification: item.classification,
    timestamp: new Date().toISOString(),
    outcome: "success",
  });
  return item;
}

export async function listIncidents(user: User, search?: string) {
  assertCan(user, "view", { type: "incident" });
  const items = await mockIncidentRepository.list({ search });
  return items
    .filter((item) => can(user, "view", toPolicyResource("incident", item)))
    .map((item) =>
      shouldHideTechnicalFields(user.role)
        ? maskForRole(user.role, item, ["iocSummary", "internalHostHint"])
        : item,
    );
}

export async function getIncident(user: User, id: string) {
  const item = await mockIncidentRepository.getById(id);
  if (!item) return null;
  assertCan(user, "view", toPolicyResource("incident", item));
  const masked = shouldHideTechnicalFields(user.role)
    ? maskForRole(user.role, item, ["iocSummary", "internalHostHint"])
    : item;
  await mockAuditRepository.append({
    action: "detail_view",
    actorId: user.id,
    actorRole: user.role,
    resourceType: "incident",
    resourceId: id,
    summary: `Viewed incident ${id}`,
    classification: item.classification,
    timestamp: new Date().toISOString(),
    outcome: "success",
  });
  return masked;
}

export async function listAssets(user: User, search?: string) {
  assertCan(user, "view", { type: "asset" });
  const items = await mockAssetRepository.list({ search });
  return items.filter((item) => can(user, "view", toPolicyResource("asset", item)));
}

export async function getAsset(user: User, id: string) {
  const item = await mockAssetRepository.getById(id);
  if (!item) return null;
  assertCan(user, "view", toPolicyResource("asset", item));
  return item;
}

export async function listVulnerabilities(user: User, search?: string) {
  assertCan(user, "view", { type: "vulnerability" });
  const items = await mockVulnerabilityRepository.list({ search });
  return items
    .filter((item) => can(user, "view", toPolicyResource("vulnerability", item)))
    .map((item) =>
      shouldHideTechnicalFields(user.role)
        ? maskForRole(user.role, item, ["technicalDetail"])
        : item,
    );
}

export async function getVulnerability(user: User, id: string) {
  const item = await mockVulnerabilityRepository.getById(id);
  if (!item) return null;
  assertCan(user, "view", toPolicyResource("vulnerability", item));
  return shouldHideTechnicalFields(user.role)
    ? maskForRole(user.role, item, ["technicalDetail"])
    : item;
}

export async function listPlants(user: User, search?: string) {
  assertCan(user, "view", { type: "plant" });
  const items = await mockPlantRepository.list({ search });
  return items.filter((item) => can(user, "view", toPolicyResource("plant", item)));
}

export async function getPlant(user: User, id: string) {
  const item = await mockPlantRepository.getById(id);
  if (!item) return null;
  assertCan(user, "view", toPolicyResource("plant", item));
  return item;
}

export async function listSuppliers(user: User, search?: string) {
  assertCan(user, "view", { type: "supplier" });
  const items = await mockSupplierRepository.list({ search });
  return items.filter((item) =>
    can(user, "view", toPolicyResource("supplier", item)),
  );
}

export async function getSupplier(user: User, id: string) {
  const item = await mockSupplierRepository.getById(id);
  if (!item) return null;
  assertCan(user, "view", toPolicyResource("supplier", item));
  return item;
}

export async function listKnowledge(user: User, search?: string) {
  assertCan(user, "view", { type: "knowledge" });
  const items = await mockKnowledgeRepository.list({ search });
  return items.filter((item) =>
    can(user, "view", toPolicyResource("knowledge", item)),
  );
}

export async function getKnowledge(user: User, id: string) {
  const item = await mockKnowledgeRepository.getById(id);
  if (!item) return null;
  assertCan(user, "view", toPolicyResource("knowledge", item));
  return item;
}

export async function listServiceRequests(user: User, search?: string) {
  assertCan(user, "view", { type: "service_request" });
  const items = await mockServiceRequestRepository.list({ search });
  return items.filter((item) =>
    can(user, "view", toPolicyResource("service_request", item)),
  );
}

export async function getServiceRequest(user: User, id: string) {
  const item = await mockServiceRequestRepository.getById(id);
  if (!item) return null;
  assertCan(user, "view", toPolicyResource("service_request", item));
  return item;
}

export async function listClocks(user: User, search?: string) {
  assertCan(user, "view", { type: "regulatory_clock" });
  const items = await mockClockRepository.list({ search });
  return items.filter((item) =>
    can(user, "view", toPolicyResource("regulatory_clock", item)),
  );
}

export async function getClock(user: User, id: string) {
  const item = await mockClockRepository.getById(id);
  if (!item) return null;
  assertCan(user, "view", toPolicyResource("regulatory_clock", item));
  return item;
}

export async function listAuditEvents(user: User) {
  assertCan(user, "view", { type: "audit_trail" });
  return mockAuditRepository.list();
}

export async function getDashboard(user: User) {
  assertCan(user, "view", { type: "dashboard" });
  const [risks, incidents, plants, vulns, suppliers, tasks] = await Promise.all([
    listRisks(user).catch(() => []),
    listIncidents(user).catch(() => []),
    listPlants(user).catch(() => []),
    listVulnerabilities(user).catch(() => []),
    listSuppliers(user).catch(() => []),
    Promise.resolve(
      mockActionItems.filter((t) =>
        can(user, "view", toPolicyResource("dashboard", t)),
      ),
    ),
  ]);

  const metrics = mockMetrics.filter((m) => {
    if (m.id.includes("vuln")) return can(user, "view", { type: "vulnerability" });
    if (m.id.includes("incident")) return can(user, "view", { type: "incident" });
    return true;
  });

  return {
    tasks: tasks.slice(0, 5),
    topRisks: risks.slice(0, 5),
    incidents: incidents.slice(0, 5),
    plants: plants.slice(0, 5),
    criticalVulns: vulns.filter((v) => v.severity === "critical" || v.severity === "high"),
    suppliers: suppliers.slice(0, 5),
    products: mockProducts,
    metrics,
  };
}

export type SearchResult = {
  id: string;
  type: string;
  title: string;
  summary: string;
  classification: string;
  updatedAt: string;
  href: string;
};

export async function globalSearch(user: User, q: string): Promise<SearchResult[]> {
  if (!q.trim()) return [];
  const results: SearchResult[] = [];

  const push = (
    type: ResourceType,
    id: string,
    title: string,
    summary: string,
    classification: string,
    updatedAt: string,
    href: string,
    resource: Parameters<typeof can>[2],
  ) => {
    if (!can(user, "view", resource)) return;
    results.push({ id, type, title, summary, classification, updatedAt, href });
  };

  const [risks, incidents, assets, vulns, plants, suppliers, requests, knowledge] =
    await Promise.all([
      mockRiskRepository.list({ search: q }),
      mockIncidentRepository.list({ search: q }),
      mockAssetRepository.list({ search: q }),
      mockVulnerabilityRepository.list({ search: q }),
      mockPlantRepository.list({ search: q }),
      mockSupplierRepository.list({ search: q }),
      mockServiceRequestRepository.list({ search: q }),
      mockKnowledgeRepository.list({ search: q }),
    ]);

  for (const r of risks) {
    push("risk", r.id, r.title, r.summary, r.classification, r.updatedAt, `/governance/risks/${r.id}`, toPolicyResource("risk", r));
  }
  for (const r of incidents) {
    push("incident", r.id, r.title, r.summary, r.classification, r.updatedAt, `/operations/incidents/${r.id}`, toPolicyResource("incident", r));
  }
  for (const r of assets) {
    push("asset", r.id, r.name, r.assetType, r.classification, r.updatedAt, `/protection/assets/${r.id}`, toPolicyResource("asset", r));
  }
  for (const r of vulns) {
    push("vulnerability", r.id, r.title, r.remediationStatus, r.classification, r.updatedAt, `/protection/vulnerabilities/${r.id}`, toPolicyResource("vulnerability", r));
  }
  for (const r of plants) {
    push("plant", r.id, r.name, r.code, r.classification, r.updatedAt, `/manufacturing/plants/${r.id}`, toPolicyResource("plant", r));
  }
  for (const r of suppliers) {
    push("supplier", r.id, r.name, `Tier ${r.tier}`, r.classification, r.updatedAt, `/supply-chain/${r.id}`, toPolicyResource("supplier", r));
  }
  for (const r of requests) {
    push("service_request", r.id, r.title, r.serviceType, r.classification, r.updatedAt, `/services/${r.id}`, toPolicyResource("service_request", r));
  }
  for (const r of knowledge) {
    push("knowledge", r.id, r.metadata.title, r.summary, r.classification, r.updatedAt, `/knowledge/${r.id}`, toPolicyResource("knowledge", r));
  }
  for (const r of mockProducts) {
    if (`${r.productFamily}`.toLowerCase().includes(q.toLowerCase())) {
      push("product_security", r.id, r.productFamily, r.secureSdlcStatus, r.classification, r.updatedAt, `/manufacturing/product-security`, toPolicyResource("product_security", r));
    }
  }

  return results.slice(0, 50);
}
