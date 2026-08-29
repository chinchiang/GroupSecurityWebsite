"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { assertCan } from "@/lib/authorization/guards";
import {
  incidentReportSchema,
  phishingReportSchema,
  serviceRequestSchema,
} from "@/domain/validation/schemas";
import {
  mockAuditRepository,
  mockIncidentRepository,
  mockServiceRequestRepository,
} from "@/adapters/mock/repositories";
import { isMutatingRole } from "@/domain/policies/rbac";

export type ActionResult =
  | { ok: true; id: string; message: string }
  | { ok: false; errors: string[] };

const MAX_PAYLOAD = 50_000;

function payloadTooLarge(data: unknown): boolean {
  return JSON.stringify(data).length > MAX_PAYLOAD;
}

export async function submitIncidentReport(
  raw: unknown,
): Promise<ActionResult> {
  if (payloadTooLarge(raw)) {
    return { ok: false, errors: ["Payload exceeds size limit"] };
  }
  const session = await requireSession();
  if (!isMutatingRole(session.user.role)) {
    return { ok: false, errors: ["Auditor/executive cannot modify data"] };
  }
  assertCan(session.user, "create", { type: "incident" });
  const parsed = incidentReportSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    };
  }
  const incident = await mockIncidentRepository.createFromReport(
    parsed.data,
    session.user.id,
  );
  await mockAuditRepository.append({
    action: "create",
    actorId: session.user.id,
    actorRole: session.user.role,
    resourceType: "incident",
    resourceId: incident.id,
    summary: "Demo incident report submitted",
    classification: "confidential",
    timestamp: new Date().toISOString(),
    outcome: "success",
  });
  revalidatePath("/operations/incidents");
  return { ok: true, id: incident.id, message: "Demo incident created" };
}

export async function submitPhishingReport(
  raw: unknown,
): Promise<ActionResult> {
  if (payloadTooLarge(raw)) {
    return { ok: false, errors: ["Payload exceeds size limit"] };
  }
  const session = await requireSession();
  if (!isMutatingRole(session.user.role)) {
    return { ok: false, errors: ["Auditor/executive cannot modify data"] };
  }
  assertCan(session.user, "create", { type: "incident" });
  const parsed = phishingReportSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    };
  }
  const incident = await mockIncidentRepository.createFromPhishing(
    parsed.data,
    session.user.id,
  );
  await mockAuditRepository.append({
    action: "create",
    actorId: session.user.id,
    actorRole: session.user.role,
    resourceType: "incident",
    resourceId: incident.id,
    summary: "Demo phishing report submitted",
    classification: "internal",
    timestamp: new Date().toISOString(),
    outcome: "success",
  });
  revalidatePath("/operations/incidents");
  return { ok: true, id: incident.id, message: "Demo phishing report created" };
}

export async function submitServiceRequest(
  raw: unknown,
): Promise<ActionResult> {
  if (payloadTooLarge(raw)) {
    return { ok: false, errors: ["Payload exceeds size limit"] };
  }
  const session = await requireSession();
  if (!isMutatingRole(session.user.role)) {
    return { ok: false, errors: ["Auditor/executive cannot modify data"] };
  }
  assertCan(session.user, "create", { type: "service_request" });
  const parsed = serviceRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    };
  }
  const request = await mockServiceRequestRepository.create(
    parsed.data,
    session.user.id,
  );
  await mockAuditRepository.append({
    action: "create",
    actorId: session.user.id,
    actorRole: session.user.role,
    resourceType: "service_request",
    resourceId: request.id,
    summary: "Demo service request submitted",
    classification: parsed.data.dataClassification,
    timestamp: new Date().toISOString(),
    outcome: "success",
  });
  revalidatePath("/services");
  return { ok: true, id: request.id, message: "Demo service request created" };
}
