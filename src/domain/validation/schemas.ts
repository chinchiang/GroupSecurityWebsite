import { z } from "zod";
import { DATA_CLASSIFICATIONS, SEVERITY_LEVELS } from "@/config/site";
import { USER_ROLES } from "@/config/roles";

export const dataClassificationSchema = z.enum(DATA_CLASSIFICATIONS);
export const severitySchema = z.enum(SEVERITY_LEVELS);
export const userRoleSchema = z.enum(USER_ROLES);

export const incidentReportSchema = z.object({
  incidentType: z.string().min(1).max(120),
  summary: z.string().min(5).max(200),
  description: z.string().min(10).max(4000),
  affectedSystem: z.string().max(200).optional().or(z.literal("")),
  affectedSitePlant: z.string().min(1).max(120),
  observedAt: z.string().min(1),
  businessImpact: z.string().min(1).max(500),
  safetyImpact: z.enum(["yes", "no", "unknown"]),
  dataInvolved: z.string().max(500).optional().or(z.literal("")),
  contactPreference: z.enum(["email", "phone", "teams"]),
  urgency: z.enum(["critical", "high", "medium", "low"]),
  submitAnonymouslyAcknowledged: z.boolean(),
});

export type IncidentReportInput = z.infer<typeof incidentReportSchema>;

export const phishingReportSchema = z.object({
  emailSubject: z.string().min(1).max(300),
  senderDisplayName: z.string().min(1).max(200),
  senderAddress: z.string().email().max(320),
  receivedTime: z.string().min(1),
  suspiciousReason: z.string().min(5).max(2000),
  hasAttachment: z.enum(["yes", "no", "unknown"]),
  hasLink: z.enum(["yes", "no", "unknown"]),
  additionalNotes: z.string().max(2000).optional().or(z.literal("")),
});

export type PhishingReportInput = z.infer<typeof phishingReportSchema>;

export const serviceRequestSchema = z.object({
  serviceType: z.string().min(1).max(120),
  businessJustification: z.string().min(10).max(4000),
  legalEntity: z.string().min(1).max(120),
  site: z.string().min(1).max(120),
  projectSystem: z.string().min(1).max(200),
  dataClassification: dataClassificationSchema,
  requestedDate: z.string().min(1),
  requiredCompletionDate: z.string().min(1),
  approver: z.string().min(1).max(120),
  contact: z.string().min(1).max(200),
});

export type ServiceRequestInput = z.infer<typeof serviceRequestSchema>;
