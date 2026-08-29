import { describe, expect, it } from "vitest";
import { can, isMutatingRole } from "@/domain/policies/rbac";
import { DEMO_USERS } from "@/lib/auth/types";
import { hoursUntil, calculateMetricPercent } from "@/lib/formatting/metrics";
import { formatSeverity, formatPercent } from "@/lib/formatting";
import { t } from "@/lib/i18n/dictionaries";
import {
  incidentReportSchema,
  phishingReportSchema,
  serviceRequestSchema,
} from "@/domain/validation/schemas";

describe("RBAC policy", () => {
  it("denies employee admin access", () => {
    expect(can(DEMO_USERS.employee, "view", { type: "admin" })).toBe(false);
  });

  it("allows portal admin administer", () => {
    expect(can(DEMO_USERS.portal_admin, "administer", { type: "admin" })).toBe(
      true,
    );
  });

  it("denies auditor update", () => {
    expect(can(DEMO_USERS.auditor, "update", { type: "risk" })).toBe(false);
    expect(isMutatingRole("auditor")).toBe(false);
  });
});

describe("ABAC scope filtering", () => {
  it("limits OT engineer to Plant A", () => {
    expect(
      can(DEMO_USERS.ot_engineer, "view", {
        type: "plant",
        plant: "Plant A",
        classification: "confidential",
      }),
    ).toBe(true);
    expect(
      can(DEMO_USERS.ot_engineer, "view", {
        type: "plant",
        plant: "Plant B",
        classification: "confidential",
      }),
    ).toBe(false);
  });
});

describe("data classification filtering", () => {
  it("blocks employee from restricted", () => {
    expect(
      can(DEMO_USERS.employee, "view", {
        type: "incident",
        classification: "restricted",
      }),
    ).toBe(false);
  });
});

describe("formatting", () => {
  it("formats severity", () => {
    expect(formatSeverity("critical", "zh-TW")).toContain("嚴重");
    expect(formatSeverity("high", "en")).toBe("High");
  });

  it("formats percent", () => {
    expect(formatPercent(0.5, "en")).toMatch(/50/);
  });
});

describe("regulatory clock calculation", () => {
  it("computes hours until due", () => {
    const hours = hoursUntil(
      "2026-08-02T00:00:00.000Z",
      "2026-08-01T00:00:00.000Z",
    );
    expect(hours).toBe(24);
  });
});

describe("metric calculation", () => {
  it("handles zero denominator", () => {
    expect(calculateMetricPercent(1, 0)).toBe(0);
    expect(calculateMetricPercent(1, 2)).toBe(0.5);
  });
});

describe("translation fallback", () => {
  it("falls back to key when missing", () => {
    expect(t("en", "does.not.exist")).toBe("does.not.exist");
    expect(t("zh-TW", "nav.home")).toBe("首頁");
  });
});

describe("input validation", () => {
  it("validates incident report", () => {
    const bad = incidentReportSchema.safeParse({});
    expect(bad.success).toBe(false);
    const good = incidentReportSchema.safeParse({
      incidentType: "Phishing",
      summary: "Demo summary text",
      description: "Long enough demo description",
      affectedSitePlant: "Plant A",
      observedAt: "2026-08-01T10:00",
      businessImpact: "Limited",
      safetyImpact: "no",
      contactPreference: "email",
      urgency: "medium",
      submitAnonymouslyAcknowledged: true,
    });
    expect(good.success).toBe(true);
  });

  it("validates phishing and service request", () => {
    expect(
      phishingReportSchema.safeParse({
        emailSubject: "Urgent",
        senderDisplayName: "Demo Sender",
        senderAddress: "a@example.invalid",
        receivedTime: "2026-08-01T10:00",
        suspiciousReason: "Looks suspicious enough",
        hasAttachment: "no",
        hasLink: "yes",
      }).success,
    ).toBe(true);
    expect(
      serviceRequestSchema.safeParse({
        serviceType: "Review",
        businessJustification: "Need architecture review now",
        legalEntity: "Legal Entity A",
        site: "Site Alpha",
        projectSystem: "Demo System",
        dataClassification: "internal",
        requestedDate: "2026-08-01",
        requiredCompletionDate: "2026-08-15",
        approver: "Demo Security Manager",
        contact: "demo@example.invalid",
      }).success,
    ).toBe(true);
  });
});
