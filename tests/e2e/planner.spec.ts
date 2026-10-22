import { test, expect, type Page } from "@playwright/test";
import brief from "../fixtures/event-input.json" with { type: "json" };
import fixture from "../fixtures/plan-output.json" with { type: "json" };
import AxeBuilder from "@axe-core/playwright";
import { PDFDocument } from "pdf-lib";
import { readFile } from "node:fs/promises";

async function enterBrief(page: Page, name: string) {
  await page.goto("/planner?type=birthday");
  await page.getByLabel("Give it a little name").fill(name);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("When’s the occasion?").fill(brief.eventDate);
  await page.getByLabel("How many people?").fill(String(brief.guestCount));
  await page.getByLabel("Your total budget").fill(String(brief.budgetMinor / 100));
  await page.getByLabel("City or region").fill(brief.location);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("The vibe & your preferences").fill(brief.preferences.join(", "));
  await page.getByLabel("Anything to leave out?").fill(brief.exclusions.join(", "));
}
test("landing, dashboard, themes, filters and responsive overflow", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("worth gathering");
  await page.getByRole("link", { name: "Explore the studio", exact: true }).click();
  await expect(page.getByText("You’re exploring a sample workspace.", { exact: false })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Good things are taking shape." })).toBeVisible();
  await page.getByLabel("Toggle light or dark theme").click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByLabel("Search events").fill("Sunday");
  await expect(page.locator(".event-card")).toHaveCount(1);
  await page.getByLabel("Search events").fill("no-such-celebration");
  await expect(page.getByText("No celebrations match just yet.")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
test("a draft survives refresh and can be deleted deliberately", async ({ page }) => {
  await enterBrief(page, "A birthday draft");
  await page.getByRole("button", { name: "Save as draft" }).click();
  await expect(page).toHaveURL(/\/events\//);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("A birthday draft");
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("A birthday draft");
  await page.getByLabel("Delete event", { exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Keep the event" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("A birthday draft");
  await page.getByLabel("Delete event", { exact: true }).click();
  await page.getByRole("button", { name: "Delete event", exact: true }).click();
  await expect(page).toHaveURL(/\/events$/);
  await expect(page.locator(".event-card")).toHaveCount(0);
});
test("mocked generation, spending, checklist, vendors and status persist", async ({ page }) => {
  await page.route("**/api/plans", async route => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: fixture, effectiveEvent: route.request().postDataJSON(), requestId: "synthetic-browser-check" }) });
  });
  await enterBrief(page, brief.title);
  await page.getByRole("button", { name: "Generate my plan" }).click();
  await expect(page).toHaveURL(/\/events\//);
  await expect(page.getByRole("heading", { name: "Golden hour", exact: true })).toBeVisible();
  await page.getByRole("tab", { name: "Budget", exact: true }).click();
  await page.getByLabel("Actual spending for Food & drinks", { exact: true }).fill("125.50");
  await page.getByLabel("Actual spending for Food & drinks", { exact: true }).press("Enter");
  await expect(page.getByText("₹125.50", { exact: true })).toBeVisible();
  await page.getByRole("tab", { name: "Preparation" }).click();
  await page.getByRole("checkbox", { name: /Confirm venue accessibility/ }).check();
  await expect(page.getByRole("checkbox", { name: /Confirm venue accessibility/ })).toBeChecked();
  await page.getByRole("tab", { name: "Vendors", exact: true }).click();
  await page.getByLabel("Status for Food & catering").selectOption("contacted");
  await page.getByLabel("Event status").selectOption("confirmed");
  await page.reload();
  await expect(page.getByLabel("Event status")).toHaveValue("confirmed");
  await page.getByRole("tab", { name: "Budget", exact: true }).click();
  await expect(page.getByLabel("Actual spending for Food & drinks", { exact: true })).toHaveValue("125.5");
  await page.getByRole("tab", { name: "Preparation" }).click();
  await expect(page.getByRole("checkbox", { name: /Confirm venue accessibility/ })).toBeChecked();
  await page.getByRole("tab", { name: "Vendors", exact: true }).click();
  await expect(page.getByLabel("Status for Food & catering")).toHaveValue("contacted");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test("provider failure preserves the brief and offers a draft", async ({ page }) => {
  await page.route("**/api/plans", route => route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: { code: "AI_UNAVAILABLE", message: "The AI planner is temporarily unavailable." }, requestId: "synthetic-failure" }) }));
  await enterBrief(page, "A resilient little plan");
  await page.getByRole("button", { name: "Generate my plan" }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText("temporarily unavailable");
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(page.getByLabel("Give it a little name")).toHaveValue("A resilient little plan");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Save as draft" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("A resilient little plan");
});
test("creative refinement keeps the effective event constraints", async ({ page }) => {
  await page.route("**/api/plans", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: fixture, effectiveEvent: route.request().postDataJSON(), requestId: "synthetic-generate" }) }));
  await page.route("**/api/plans/refine", route => {
    const request = route.request().postDataJSON();
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: { ...fixture, theme: { ...fixture.theme, name: "A quieter afternoon" } }, effectiveEvent: request.event, requestId: "synthetic-refine" }) });
  });
  await enterBrief(page, brief.title);
  await page.getByRole("button", { name: "Generate my plan" }).click();
  await page.getByLabel("How would you like to refine the plan?").fill("Quieter activities");
  await page.getByRole("button", { name: "Refine with AI" }).click();
  await expect(page.getByRole("heading", { name: "A quieter afternoon" })).toBeVisible();
  await expect(page.getByText("₹15,000.00 budget", { exact: true })).toBeVisible();
});
test("corrupt saved data is not silently overwritten", async ({ page }) => {
  await page.goto("/dashboard");
  await page.evaluate(() => localStorage.setItem("eventloom.events.v1", "broken-data"));
  await page.reload();
  await expect(page.locator("main").getByRole("alert")).toContainText(/not been overwritten|unreadable/);
  expect(await page.evaluate(() => localStorage.getItem("eventloom.events.v1"))).toBe("broken-data");
});
test("mobile navigation returns focus and planning tabs support arrow keys", async ({ page }) => {
  await page.goto("/dashboard");
  const menu = page.getByRole("button", { name: "Open navigation" });
  if (await menu.isVisible()) {
    await menu.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(menu).toBeFocused();
    await menu.click();
    await page.getByRole("dialog").getByRole("link", { name: "Budget studio", exact: true }).click();
  } else {
    await page.getByRole("link", { name: "Budget studio", exact: true }).click();
  }
  await expect(page).toHaveURL(/\/budget$/);
  await page.goto("/events/sample-wedding");
  const timeline = page.getByRole("tab", { name: "Timeline", exact: true });
  await timeline.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Preparation", exact: true })).toHaveAttribute("aria-selected", "true");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("editing a name preserves the plan and expense records", async ({ page }) => {
  await page.goto("/events/sample-wedding");
  await page.getByRole("tab", { name: "Budget", exact: true }).click();
  const expense = page.getByRole("spinbutton").first();
  await expense.fill("123.45"); await expense.press("Enter");
  await page.getByRole("link", { name: "Edit details" }).click();
  await page.getByLabel("Give it a little name").fill("A thoughtfully renamed wedding");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Save details", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("A thoughtfully renamed wedding");
  await page.getByRole("tab", { name: "Budget", exact: true }).click();
  await expect(page.getByRole("spinbutton").first()).toHaveValue("123.45");
  await page.getByRole("link", { name: "Edit details" }).click();
  await page.getByLabel("Give it a little name").fill("A stale unsaved title");
  await page.evaluate(() => {
    const events = JSON.parse(localStorage.getItem("eventloom.events.v1")!);
    events[0].brief.title = "Updated in another session";
    events[0].updatedAt = new Date(Date.now() + 1000).toISOString();
    localStorage.setItem("eventloom.events.v1", JSON.stringify(events));
    window.dispatchEvent(new Event("storage"));
  });
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Save details", exact: true }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText("changed while you were editing");
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("eventloom.events.v1")!)[0].brief.title)).toBe("Updated in another session");
});

test("regeneration requires confirmation and failure keeps the existing plan", async ({ page }) => {
  await page.route("**/api/plans", route => route.fulfill({ status: 504, contentType: "application/json", body: JSON.stringify({ error: { message: "Planning timed out. Please try again." } }) }));
  await page.goto("/events/sample-wedding");
  const heading = await page.locator(".theme-section h2").textContent();
  page.once("dialog", dialog => dialog.dismiss());
  await page.getByRole("button", { name: "Regenerate plan", exact: true }).click();
  await expect(page.locator(".theme-section h2")).toHaveText(heading!);
  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name: "Regenerate plan", exact: true }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText("timed out");
  await expect(page.locator(".theme-section h2")).toHaveText(heading!);
});

test("a PDF downloads with a real report and a readable print alternative", async ({ page }) => {
  await page.goto("/events/sample-wedding");
  const title = await page.getByRole("heading", { level: 1 }).textContent();
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PDF", exact: true }).click();
  const download = await downloaded;
  expect(download.suggestedFilename()).toMatch(/^eventloom-.+\.pdf$/);
  const pdf = await PDFDocument.load(await readFile((await download.path())!));
  expect(pdf.getTitle()).toBe(title);
  expect(pdf.getPageCount()).toBeGreaterThan(1);
  await page.getByRole("link", { name: "Readable report", exact: true }).click();
  for (const name of ["Budget & expenses", "Event-day timeline", "Vendor checklist"]) await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".studio-topbar")).not.toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("backup restore validates first and requires deliberate replacement", async ({ page }) => {
  await page.goto("/settings");
  await page.getByLabel("Restore a backup").setInputFiles({ name: "broken.json", mimeType: "application/json", buffer: Buffer.from("broken") });
  await expect(page.locator("main").getByRole("alert")).toContainText("not been changed");
  expect(await page.evaluate(() => localStorage.getItem("eventloom.events.v1"))).toBeNull();
  const saved = { id: "restored-draft", brief, plan: null, source: "draft", status: "planning", completedTasks: [], vendorStatus: {}, actualSpent: {}, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  const backup = { name: "valid.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify([saved])) };
  await page.getByLabel("Restore a backup").setInputFiles(backup);
  await page.getByRole("button", { name: "Keep my workspace" }).click();
  expect(await page.evaluate(() => localStorage.getItem("eventloom.events.v1"))).toBeNull();
  await page.getByLabel("Restore a backup").setInputFiles(backup);
  await page.getByRole("button", { name: "Restore backup", exact: true }).click();
  await expect(page.getByText("Your backup has been restored on this device.")).toBeVisible();
  await page.goto("/events/restored-draft");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(brief.title);
});

test("unavailable storage never reports a successful save", async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException("full", "QuotaExceededError"); }; });
  await page.goto("/events/sample-wedding");
  await page.getByLabel("Event status").selectOption("completed");
  await expect(page.locator("main").getByRole("alert")).toContainText("couldn't save");
  await expect(page.getByLabel("Event status")).toHaveValue("planning");
});

test("responsive layout and automated accessibility across core screens", async ({ page }, testInfo) => {
  test.setTimeout(90_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/events/sample-wedding/report");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  for (const path of ["/", "/planner", "/settings", "/auth/sign-in", "/events/sample-wedding/report"]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(results.violations, JSON.stringify(results.violations)).toEqual([]);
    await page.evaluate(() => document.documentElement.classList.add("dark"));
    const dark = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(dark.violations, JSON.stringify(dark.violations)).toEqual([]);
  }
  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    return { domContentLoadedMs: nav.domContentLoadedEventEnd, transferBytes: nav.transferSize, resources: performance.getEntriesByType("resource").length, width: innerWidth };
  });
  await testInfo.attach("local-performance.json", { body: JSON.stringify(metrics), contentType: "application/json" });
});
