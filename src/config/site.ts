export const siteConfig = {
  brandName: "Global Manufacturing Cybersecurity Portal",
  shortName: "Cybersecurity Portal",
  logoPath: "/logo.svg",
  defaultLocale: "zh-TW" as const,
  supportedLocales: ["zh-TW", "en"] as const,
  demoMode: true,
  organization: {
    name: "Global Manufacturing Group",
    legalEntities: ["Legal Entity A", "Legal Entity B"],
    businessGroups: ["Business Group A", "Business Group B"],
    regions: ["APAC", "EMEA", "Americas"],
    sites: ["Site Alpha", "Site Beta", "Site Gamma"],
    plants: ["Plant A", "Plant B", "Plant C"],
    products: ["Product Family A", "Product Family B"],
  },
  emergencyContacts: [
    {
      id: "ec-soc",
      label: "SOC Hotline (Demo)",
      value: "+000-000-0000 (Demo)",
      channel: "phone" as const,
    },
    {
      id: "ec-ciso",
      label: "CISO Duty (Demo)",
      value: "ciso-duty@example.invalid",
      channel: "email" as const,
    },
  ],
  dataRefreshHint: "Demo fixtures — last refreshed at build/demo session start",
} as const;

export type Locale = (typeof siteConfig.supportedLocales)[number];

export const DATA_CLASSIFICATIONS = [
  "internal",
  "confidential",
  "restricted",
] as const;

export type DataClassification = (typeof DATA_CLASSIFICATIONS)[number];

export const SEVERITY_LEVELS = [
  "critical",
  "high",
  "medium",
  "low",
  "informational",
] as const;

export type SeverityLevel = (typeof SEVERITY_LEVELS)[number];

export const RISK_LEVELS = ["critical", "high", "medium", "low"] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

export const STATUS_LABELS = {
  open: { zhTW: "開啟", en: "Open" },
  in_progress: { zhTW: "處理中", en: "In Progress" },
  pending: { zhTW: "待處理", en: "Pending" },
  resolved: { zhTW: "已解決", en: "Resolved" },
  closed: { zhTW: "已關閉", en: "Closed" },
  accepted: { zhTW: "已接受", en: "Accepted" },
  draft: { zhTW: "草案", en: "Draft" },
  under_review: { zhTW: "審查中", en: "Under Review" },
  approved: { zhTW: "已核准", en: "Approved" },
  superseded: { zhTW: "已被取代", en: "Superseded" },
  expired: { zhTW: "已失效", en: "Expired" },
  unverified: { zhTW: "尚未核實", en: "Unverified" },
  demo: { zhTW: "示範資料", en: "Demo" },
} as const;
