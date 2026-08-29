export const features = {
  regulatoryClock: true,
  otSecurity: true,
  productSecurity: true,
  aiSecurity: true,
  supplierRisk: true,
  roleSwitcher: process.env.NODE_ENV === "development",
} as const;

export type FeatureFlag = keyof typeof features;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return Boolean(features[flag]);
}
