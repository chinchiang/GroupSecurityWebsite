import type { DataClassification } from "@/config/site";
import type { UserRole } from "@/config/roles";

export type { UserRole };

export interface AccessScope {
  legalEntities: string[];
  businessGroups: string[];
  regions: string[];
  sites: string[];
  plants: string[];
  products: string[];
  dataClassifications: DataClassification[];
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
  scope: AccessScope;
  preferredLocale: "zh-TW" | "en";
  isDemoIdentity: true;
}

export interface UserSession {
  user: User;
  authenticatedAt: string;
  provider: "mock";
  expiresAt: string;
}

export interface ChangeRecord {
  version: string;
  changedAt: string;
  changedBy: string;
  summary: string;
}

export interface ContentMetadata {
  id: string;
  title: string;
  owner: string;
  approver?: string;
  classification: DataClassification;
  applicableLegalEntities: string[];
  applicableRegions: string[];
  applicableAudiences: string[];
  authoritativeSource?: string;
  frameworkReferences: string[];
  version: string;
  status:
    | "draft"
    | "under_review"
    | "approved"
    | "superseded"
    | "expired"
    | "unverified";
  effectiveDate?: string;
  lastVerifiedDate?: string;
  nextReviewDate?: string;
  expiryDate?: string;
  supersededBy?: string;
  changeHistory: ChangeRecord[];
}

export interface ScopedEntity {
  id: string;
  classification: DataClassification;
  legalEntity?: string;
  businessGroup?: string;
  region?: string;
  site?: string;
  plant?: string;
  product?: string;
  owner: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  sourceSystem: string;
  isDemoData: true;
}

export interface ActionItem extends ScopedEntity {
  title: string;
  description: string;
  dueDate: string;
  priority: "critical" | "high" | "medium" | "low";
  assignee: string;
  relatedRecordType?: string;
  relatedRecordId?: string;
}

export interface Risk extends ScopedEntity {
  title: string;
  summary: string;
  riskLevel: "critical" | "high" | "medium" | "low";
  inherentScore: number;
  residualScore: number;
  category: string;
  treatment: string;
  dueDate?: string;
  frameworkReferences: string[];
}

export interface Control extends ScopedEntity {
  controlId: string;
  title: string;
  description: string;
  frameworkMappings: string[];
  effectiveness: "effective" | "partial" | "ineffective" | "not_tested";
}

export interface ComplianceObligation extends ScopedEntity {
  title: string;
  jurisdiction: string;
  regulation: string;
  dueDate: string;
  evidenceStatus: string;
}

export interface Incident extends ScopedEntity {
  title: string;
  summary: string;
  severity: "critical" | "high" | "medium" | "low" | "informational";
  incidentType: string;
  detectedAt: string;
  affectedSystem?: string;
  safetyImpact: boolean;
  businessImpact: string;
  iocSummary?: string;
  internalHostHint?: string;
}

export interface RegulatoryClock extends ScopedEntity {
  relatedIncidentId: string;
  jurisdiction: string;
  regulation: string;
  triggerStatus: "not_triggered" | "triggered" | "under_review";
  triggerCriteria: string;
  awarenessTimestamp: string;
  earlyWarningDue: string;
  notificationDue: string;
  finalReportDue: string;
  responsibleOwner: string;
  legalReviewer: string;
  submissionStatus: "not_submitted" | "draft" | "demo_submitted";
  submittedTimestamp?: string;
  submissionReceipt?: string;
  evidenceSnapshot: string;
}

export interface Asset extends ScopedEntity {
  name: string;
  assetType: string;
  criticality: "critical" | "high" | "medium" | "low";
  environment: "IT" | "Cloud" | "OT" | "Product";
  businessService?: string;
}

export interface Vulnerability extends ScopedEntity {
  title: string;
  cveId?: string;
  severity: "critical" | "high" | "medium" | "low";
  affectedAssetId: string;
  remediationStatus: string;
  dueDate?: string;
  technicalDetail?: string;
}

export interface Plant extends ScopedEntity {
  name: string;
  code: string;
  otRiskLevel: "critical" | "high" | "medium" | "low";
  unsupportedOtCount: number;
  remoteAccessVendors: number;
  recoveryReadiness: "ready" | "partial" | "not_ready";
}

export interface OtAsset extends ScopedEntity {
  name: string;
  plantId: string;
  zone: string;
  protocolFamily: string;
  supportStatus: "supported" | "limited" | "unsupported";
  hostnameMasked: string;
}

export interface ProductSecurity extends ScopedEntity {
  productFamily: string;
  psirtOpenCount: number;
  sbomCoveragePercent: number;
  secureSdlcStatus: string;
}

export interface Supplier extends ScopedEntity {
  name: string;
  tier: "1" | "2" | "3";
  riskLevel: "critical" | "high" | "medium" | "low";
  lastAssessmentDate: string;
  remoteAccess: boolean;
  contractControlsStatus: string;
}

export interface ServiceRequest extends ScopedEntity {
  title: string;
  serviceType: string;
  justification: string;
  requestedDate: string;
  requiredCompletionDate: string;
  approver: string;
  contact: string;
}

export interface KnowledgeDocument extends ScopedEntity {
  metadata: ContentMetadata;
  summary: string;
  bodyPlaceholder: string;
  category: string;
}

export interface MetricMetadata {
  id: string;
  title: string;
  definition: string;
  scope: string;
  dataSource: string;
  numerator: number;
  denominator: number;
  target: number;
  currentValue: number;
  trend: "up" | "down" | "flat";
  dataOwner: string;
  lastRefreshed: string;
  dataQualityStatus: "good" | "partial" | "unknown";
  knownExclusions: string[];
  drillDownHref: string;
  isDemoData: true;
}

export type AuditAction =
  | "login"
  | "logout"
  | "role_change"
  | "scope_change"
  | "sensitive_page_view"
  | "detail_view"
  | "export"
  | "create"
  | "update"
  | "approval"
  | "risk_acceptance"
  | "policy_exception"
  | "incident_status_change"
  | "permission_change"
  | "configuration_change";

export interface AuditEvent {
  id: string;
  action: AuditAction;
  actorId: string;
  actorRole: UserRole;
  resourceType: string;
  resourceId?: string;
  summary: string;
  classification: DataClassification;
  timestamp: string;
  outcome: "success" | "denied" | "error";
  isDemoData: true;
}
