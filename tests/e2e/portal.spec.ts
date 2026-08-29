import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function switchRole(page: import("@playwright/test").Page, role: string) {
  await page.goto("/zh-TW");
  await page.getByLabel("Demo role switcher").selectOption(role);
  await page.waitForTimeout(500);
  await page.reload();
}

test.describe("Portal E2E", () => {
  test("defaults to Traditional Chinese", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/zh-TW/);
    await expect(page.getByText("資安營運總覽")).toBeVisible();
  });

  test("language switch keeps page", async ({ page }) => {
    await page.goto("/zh-TW/governance/risks");
    await page.getByRole("button", { name: "EN", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/governance\/risks/);
  });

  test("employee cannot see admin", async ({ page }) => {
    await switchRole(page, "employee");
    await page.goto("/zh-TW/admin");
    await expect(page.getByText("存取遭拒")).toBeVisible();
  });

  test("auditor cannot submit incident mutation message path", async ({
    page,
  }) => {
    await switchRole(page, "auditor");
    await page.goto("/zh-TW/my-security/report-incident");
    await page.getByLabel("Incident type").fill("Demo");
    await page.getByLabel("Summary").fill("Auditor attempt summary");
    await page.getByLabel("Description").fill("Attempting mutation as auditor");
    await page.getByLabel("Affected site / plant").fill("Plant A");
    await page.getByLabel("Business impact").fill("None");
    await page.getByRole("button", { name: /送出|Submit/ }).click();
    await expect(
      page.getByRole("alert").getByText(/cannot modify|Auditor/i),
    ).toBeVisible();
  });

  test("OT engineer only authorized plants", async ({ page }) => {
    await switchRole(page, "ot_engineer");
    await page.goto("/zh-TW/manufacturing/plants");
    await expect(page.getByText("Plant A").first()).toBeVisible();
    await expect(page.getByText("Plant B")).toHaveCount(0);
  });

  test("executive masking on incident detail", async ({ page }) => {
    await switchRole(page, "executive");
    await page.goto("/zh-TW/operations/incidents/inc-001");
    await expect(page.getByText("[REDACTED]").first()).toBeVisible();
  });

  test("demo incident submission", async ({ page }) => {
    await switchRole(page, "employee");
    await page.goto("/zh-TW/my-security/report-incident");
    await page.getByLabel("Incident type").fill("Phishing");
    await page.getByLabel("Summary").fill("Demo incident summary");
    await page.getByLabel("Description").fill("Demo description long enough");
    await page.getByLabel("Affected site / plant").fill("Site Alpha");
    await page.getByLabel("Business impact").fill("Low");
    await page.getByRole("button", { name: /送出|Submit/ }).click();
    await expect(page.getByText(/DEMO-INC-/)).toBeVisible({ timeout: 10000 });
  });

  test("demo service request submission", async ({ page }) => {
    await switchRole(page, "employee");
    await page.goto("/zh-TW/services/new");
    await page.getByLabel("Service type").fill("Architecture Review");
    await page
      .getByLabel("Business justification")
      .fill("Need a demo security review for project");
    await page.getByLabel("Project / system").fill("Demo System");
    await page.getByRole("button", { name: /送出|Submit/ }).click();
    await expect(page.getByText(/DEMO-SR-/)).toBeVisible({ timeout: 10000 });
  });

  test("global search respects permissions", async ({ page }) => {
    await switchRole(page, "employee");
    await page.goto("/zh-TW/search?q=Plant");
    await expect(page.getByText(/沒有符合|No results/i)).toBeVisible();
  });

  test("mobile sidebar opens", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile project only");
    await page.goto("/zh-TW");
    await page.getByLabel("Open menu").click();
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  });

  test("no obvious keyboard trap on home", async ({ page }) => {
    await page.goto("/zh-TW");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    const active = await page.evaluate(() => document.activeElement?.tagName);
    expect(active).toBeTruthy();
  });

  test("home has no critical axe violations", async ({ page }) => {
    await page.goto("/zh-TW");
    const results = await new AxeBuilder({ page })
      .disableRules(["color-contrast"])
      .analyze();
    const critical = results.violations.filter((v) => v.impact === "critical");
    expect(critical).toEqual([]);
  });
});
