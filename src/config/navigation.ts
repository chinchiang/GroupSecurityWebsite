import type { Locale } from "@/config/site";

export type NavItem = {
  id: string;
  href: string;
  labelKey: string;
  icon?: string;
  children?: NavItem[];
  resource?: string;
  roles?: string[];
};

export const mainNavigation: NavItem[] = [
  {
    id: "my-security",
    href: "/my-security",
    labelKey: "nav.mySecurity",
    icon: "Shield",
    children: [
      { id: "my-tasks", href: "/my-security", labelKey: "nav.myTasks" },
      {
        id: "report-incident",
        href: "/my-security/report-incident",
        labelKey: "nav.reportIncident",
      },
      {
        id: "report-phishing",
        href: "/my-security/report-phishing",
        labelKey: "nav.reportPhishing",
      },
      {
        id: "lost-device",
        href: "/my-security/lost-device",
        labelKey: "nav.lostDevice",
      },
      {
        id: "emergency",
        href: "/my-security/emergency",
        labelKey: "nav.emergency",
      },
    ],
  },
  {
    id: "governance",
    href: "/governance",
    labelKey: "nav.governance",
    icon: "Landmark",
    children: [
      { id: "gov-risks", href: "/governance/risks", labelKey: "nav.risks" },
      {
        id: "gov-controls",
        href: "/governance/controls",
        labelKey: "nav.controls",
      },
      {
        id: "gov-compliance",
        href: "/governance/compliance",
        labelKey: "nav.compliance",
      },
      {
        id: "gov-policies",
        href: "/governance/policies",
        labelKey: "nav.policies",
      },
      { id: "gov-audits", href: "/governance/audits", labelKey: "nav.audits" },
      {
        id: "gov-metrics",
        href: "/governance/metrics",
        labelKey: "nav.metrics",
      },
    ],
  },
  {
    id: "operations",
    href: "/operations",
    labelKey: "nav.operations",
    icon: "Radar",
    children: [
      {
        id: "ops-incidents",
        href: "/operations/incidents",
        labelKey: "nav.incidents",
      },
      {
        id: "ops-ti",
        href: "/operations/threat-intelligence",
        labelKey: "nav.threatIntel",
      },
      {
        id: "ops-detection",
        href: "/operations/detection",
        labelKey: "nav.detection",
      },
      {
        id: "ops-playbooks",
        href: "/operations/playbooks",
        labelKey: "nav.playbooks",
      },
      {
        id: "ops-clock",
        href: "/operations/regulatory-clock",
        labelKey: "nav.regulatoryClock",
      },
    ],
  },
  {
    id: "protection",
    href: "/protection",
    labelKey: "nav.protection",
    icon: "Lock",
    children: [
      {
        id: "prot-assets",
        href: "/protection/assets",
        labelKey: "nav.assets",
      },
      {
        id: "prot-vulns",
        href: "/protection/vulnerabilities",
        labelKey: "nav.vulnerabilities",
      },
      {
        id: "prot-identity",
        href: "/protection/identity",
        labelKey: "nav.identity",
      },
      { id: "prot-cloud", href: "/protection/cloud", labelKey: "nav.cloud" },
      { id: "prot-data", href: "/protection/data", labelKey: "nav.data" },
    ],
  },
  {
    id: "manufacturing",
    href: "/manufacturing",
    labelKey: "nav.manufacturing",
    icon: "Factory",
    children: [
      {
        id: "mfg-plants",
        href: "/manufacturing/plants",
        labelKey: "nav.plants",
      },
      { id: "mfg-ot", href: "/manufacturing/ot", labelKey: "nav.ot" },
      {
        id: "mfg-product",
        href: "/manufacturing/product-security",
        labelKey: "nav.productSecurity",
      },
      {
        id: "mfg-devsecops",
        href: "/manufacturing/devsecops",
        labelKey: "nav.devsecops",
      },
      {
        id: "mfg-ai",
        href: "/manufacturing/ai-security",
        labelKey: "nav.aiSecurity",
      },
    ],
  },
  {
    id: "supply-chain",
    href: "/supply-chain",
    labelKey: "nav.supplyChain",
    icon: "Truck",
  },
  {
    id: "resilience",
    href: "/resilience",
    labelKey: "nav.resilience",
    icon: "HeartPulse",
  },
  {
    id: "training",
    href: "/training",
    labelKey: "nav.training",
    icon: "GraduationCap",
  },
  {
    id: "services",
    href: "/services",
    labelKey: "nav.services",
    icon: "Briefcase",
  },
  {
    id: "knowledge",
    href: "/knowledge",
    labelKey: "nav.knowledge",
    icon: "BookOpen",
  },
  {
    id: "admin",
    href: "/admin",
    labelKey: "nav.admin",
    icon: "Settings",
    resource: "admin",
  },
];

export function localizedHref(locale: Locale, href: string): string {
  if (href.startsWith(`/${locale}`)) return href;
  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
}
