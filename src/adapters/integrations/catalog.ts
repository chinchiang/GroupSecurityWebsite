/**
 * Integration adapter stubs — no real network calls.
 * Future backend path must mediate GRC/SIEM/OT/etc.
 */

export type IntegrationAdapterStatus = "mock" | "stub" | "disabled";

export interface IntegrationAdapterInfo {
  id: string;
  name: string;
  status: IntegrationAdapterStatus;
  description: string;
}

export const integrationCatalog: IntegrationAdapterInfo[] = [
  { id: "grc", name: "GRC", status: "mock", description: "Governance risk compliance" },
  { id: "siem", name: "SIEM", status: "stub", description: "Security information and event management" },
  { id: "soar", name: "SOAR", status: "stub", description: "Security orchestration" },
  { id: "cmdb", name: "CMDB/CAASM", status: "mock", description: "Asset inventory" },
  { id: "iam", name: "IAM/IGA", status: "stub", description: "Identity governance" },
  { id: "pam", name: "PAM", status: "stub", description: "Privileged access — never browser-direct" },
  { id: "ot", name: "OT Inventory/NDR", status: "mock", description: "OT assets (masked)" },
  { id: "cloud", name: "Cloud Security", status: "stub", description: "CSPM/CNAPP" },
  { id: "dspm", name: "DSPM/DLP", status: "stub", description: "Data security posture" },
  { id: "erp", name: "ERP/Procurement", status: "stub", description: "Supplier master" },
  { id: "tprm", name: "TPRM", status: "mock", description: "Third-party risk" },
  { id: "plm", name: "PLM/ALM/SBOM", status: "stub", description: "Product security" },
  { id: "lms", name: "LMS", status: "stub", description: "Learning management" },
  { id: "itsm", name: "ITSM", status: "mock", description: "Service requests" },
];
