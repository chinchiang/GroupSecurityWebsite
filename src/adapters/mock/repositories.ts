import type {
  Asset,
  AuditEvent,
  Incident,
  KnowledgeDocument,
  Plant,
  RegulatoryClock,
  ServiceRequest,
  Supplier,
} from "@/domain/models";
import type {
  IncidentReportInput,
  PhishingReportInput,
  ServiceRequestInput,
} from "@/domain/validation/schemas";
import {
  mockAssets,
  mockAuditEvents,
  mockClocks,
  mockIncidents,
  mockKnowledge,
  mockPlants,
  mockRisks,
  mockServiceRequests,
  mockSuppliers,
  mockVulnerabilities,
} from "@/data/mock/fixtures";
import type {
  AssetRepository,
  AuditRepository,
  IncidentRepository,
  KnowledgeRepository,
  ListQuery,
  PlantRepository,
  RegulatoryClockRepository,
  RiskRepository,
  ServiceRequestRepository,
  SupplierRepository,
  VulnerabilityRepository,
} from "@/adapters/integrations/types";
import { generateDemoId } from "@/lib/utils/cn";

function applyQuery<T extends { id: string; title?: string; name?: string; summary?: string }>(
  items: T[],
  query?: ListQuery,
): T[] {
  let result = [...items];
  if (query?.search) {
    const q = query.search.toLowerCase();
    result = result.filter((item) => {
      const hay = `${item.id} ${item.title ?? ""} ${item.name ?? ""} ${item.summary ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }
  return result;
}

const incidentStore: Incident[] = [...mockIncidents];
const serviceStore: ServiceRequest[] = [...mockServiceRequests];
const auditStore: AuditEvent[] = [...mockAuditEvents];

export const mockRiskRepository: RiskRepository = {
  async list(query) {
    return applyQuery(mockRisks, query);
  },
  async getById(id) {
    return mockRisks.find((r) => r.id === id) ?? null;
  },
};

export const mockIncidentRepository: IncidentRepository = {
  async list(query) {
    return applyQuery(incidentStore, query);
  },
  async getById(id) {
    return incidentStore.find((i) => i.id === id) ?? null;
  },
  async createFromReport(input: IncidentReportInput, actorId: string) {
    const id = generateDemoId("INC");
    const incident: Incident = {
      id,
      title: input.summary,
      summary: input.description.slice(0, 240),
      severity: input.urgency === "critical" ? "critical" : input.urgency,
      incidentType: input.incidentType,
      detectedAt: input.observedAt,
      affectedSystem: input.affectedSystem || undefined,
      safetyImpact: input.safetyImpact === "yes",
      businessImpact: input.businessImpact,
      classification: "confidential",
      site: input.affectedSitePlant,
      plant: input.affectedSitePlant.includes("Plant")
        ? input.affectedSitePlant
        : undefined,
      owner: actorId,
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sourceSystem: "Mock-Portal-Form",
      isDemoData: true,
    };
    incidentStore.unshift(incident);
    return incident;
  },
  async createFromPhishing(input: PhishingReportInput, actorId: string) {
    const id = generateDemoId("PHISH");
    const incident: Incident = {
      id,
      title: `Demo Phishing — ${input.emailSubject}`,
      summary: input.suspiciousReason.slice(0, 240),
      severity: "medium",
      incidentType: "Phishing Report",
      detectedAt: input.receivedTime,
      affectedSystem: "Demo Mailbox",
      safetyImpact: false,
      businessImpact: "User-reported phishing (demo)",
      classification: "internal",
      owner: actorId,
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sourceSystem: "Mock-Portal-Form",
      isDemoData: true,
    };
    incidentStore.unshift(incident);
    return incident;
  },
};

export const mockAssetRepository: AssetRepository = {
  async list(query) {
    return applyQuery(
      mockAssets.map((a) => ({ ...a, title: a.name })),
      query,
    ) as Asset[];
  },
  async getById(id) {
    return mockAssets.find((a) => a.id === id) ?? null;
  },
};

export const mockVulnerabilityRepository: VulnerabilityRepository = {
  async list(query) {
    return applyQuery(mockVulnerabilities, query);
  },
  async getById(id) {
    return mockVulnerabilities.find((v) => v.id === id) ?? null;
  },
};

export const mockPlantRepository: PlantRepository = {
  async list(query) {
    return applyQuery(
      mockPlants.map((p) => ({ ...p, title: p.name })),
      query,
    ) as Plant[];
  },
  async getById(id) {
    return mockPlants.find((p) => p.id === id) ?? null;
  },
};

export const mockSupplierRepository: SupplierRepository = {
  async list(query) {
    return applyQuery(
      mockSuppliers.map((s) => ({ ...s, title: s.name })),
      query,
    ) as Supplier[];
  },
  async getById(id) {
    return mockSuppliers.find((s) => s.id === id) ?? null;
  },
};

export const mockKnowledgeRepository: KnowledgeRepository = {
  async list(query) {
    return applyQuery(
      mockKnowledge.map((k) => ({ ...k, title: k.metadata.title })),
      query,
    ) as KnowledgeDocument[];
  },
  async getById(id) {
    return mockKnowledge.find((k) => k.id === id) ?? null;
  },
};

export const mockServiceRequestRepository: ServiceRequestRepository = {
  async list(query) {
    return applyQuery(serviceStore, query);
  },
  async getById(id) {
    return serviceStore.find((s) => s.id === id) ?? null;
  },
  async create(input: ServiceRequestInput, actorId: string) {
    const id = generateDemoId("SR");
    const request: ServiceRequest = {
      id,
      title: `${input.serviceType} — ${input.projectSystem}`,
      serviceType: input.serviceType,
      justification: input.businessJustification,
      requestedDate: input.requestedDate,
      requiredCompletionDate: input.requiredCompletionDate,
      approver: input.approver,
      contact: input.contact,
      classification: input.dataClassification,
      legalEntity: input.legalEntity,
      site: input.site,
      owner: actorId,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sourceSystem: "Mock-Portal-Form",
      isDemoData: true,
    };
    serviceStore.unshift(request);
    return request;
  },
};

export const mockClockRepository: RegulatoryClockRepository = {
  async list(query) {
    return applyQuery(
      mockClocks.map((c) => ({
        ...c,
        title: `${c.regulation} (${c.jurisdiction})`,
      })),
      query,
    ) as RegulatoryClock[];
  },
  async getById(id) {
    return mockClocks.find((c) => c.id === id) ?? null;
  },
};

export const mockAuditRepository: AuditRepository = {
  async list() {
    return [...auditStore].sort((a, b) =>
      a.timestamp < b.timestamp ? 1 : -1,
    );
  },
  async append(event) {
    const full: AuditEvent = {
      id: event.id ?? generateDemoId("AUD"),
      action: event.action,
      actorId: event.actorId,
      actorRole: event.actorRole,
      resourceType: event.resourceType,
      resourceId: event.resourceId,
      summary: event.summary,
      classification: event.classification,
      timestamp: event.timestamp,
      outcome: event.outcome,
      isDemoData: true,
    };
    auditStore.unshift(full);
    return full;
  },
};
