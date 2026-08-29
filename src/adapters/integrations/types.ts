import type {
  Asset,
  AuditEvent,
  Incident,
  KnowledgeDocument,
  Plant,
  RegulatoryClock,
  Risk,
  ServiceRequest,
  Supplier,
  Vulnerability,
} from "@/domain/models";
import type {
  IncidentReportInput,
  PhishingReportInput,
  ServiceRequestInput,
} from "@/domain/validation/schemas";

export type ListQuery = {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

export interface RiskRepository {
  list(query?: ListQuery): Promise<Risk[]>;
  getById(id: string): Promise<Risk | null>;
}

export interface IncidentRepository {
  list(query?: ListQuery): Promise<Incident[]>;
  getById(id: string): Promise<Incident | null>;
  createFromReport(input: IncidentReportInput, actorId: string): Promise<Incident>;
  createFromPhishing(input: PhishingReportInput, actorId: string): Promise<Incident>;
}

export interface AssetRepository {
  list(query?: ListQuery): Promise<Asset[]>;
  getById(id: string): Promise<Asset | null>;
}

export interface VulnerabilityRepository {
  list(query?: ListQuery): Promise<Vulnerability[]>;
  getById(id: string): Promise<Vulnerability | null>;
}

export interface PlantRepository {
  list(query?: ListQuery): Promise<Plant[]>;
  getById(id: string): Promise<Plant | null>;
}

export interface SupplierRepository {
  list(query?: ListQuery): Promise<Supplier[]>;
  getById(id: string): Promise<Supplier | null>;
}

export interface KnowledgeRepository {
  list(query?: ListQuery): Promise<KnowledgeDocument[]>;
  getById(id: string): Promise<KnowledgeDocument | null>;
}

export interface ServiceRequestRepository {
  list(query?: ListQuery): Promise<ServiceRequest[]>;
  getById(id: string): Promise<ServiceRequest | null>;
  create(input: ServiceRequestInput, actorId: string): Promise<ServiceRequest>;
}

export interface RegulatoryClockRepository {
  list(query?: ListQuery): Promise<RegulatoryClock[]>;
  getById(id: string): Promise<RegulatoryClock | null>;
}

export interface AuditRepository {
  list(): Promise<AuditEvent[]>;
  append(event: Omit<AuditEvent, "id" | "isDemoData"> & { id?: string }): Promise<AuditEvent>;
}
