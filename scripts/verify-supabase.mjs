// Disposable confirmed users: no emails, no admin credentials written to disk.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";
import { chromium } from "@playwright/test";
process.loadEnvFile(".env.local");
const project = process.argv[2];
assert.match(project ?? "", /^[a-z]{20}$/);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
assert.equal(new URL(url).hostname, `${project}.supabase.co`);
const command = spawnSync("supabase", ["projects", "api-keys", "--project-ref", project, "--reveal", "--output", "json"], { encoding: "utf8", shell: process.platform === "win32", windowsHide: true });
assert.equal(command.status, 0, "CLI credential lookup failed");
const keys = JSON.parse(command.stdout);
const secret = keys.find(key => key.type === "secret")?.api_key ?? keys.find(key => key.name === "service_role")?.api_key;
assert.ok(secret);
const admin = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
const baseURL = process.env.EVENTLOOM_TEST_URL || "http://127.0.0.1:3100";
assert.equal(new URL(baseURL).hostname, "127.0.0.1", "Only local application targets are allowed");
const created = [], checks = [], liveFailures = [];
let browser;
try {
  const password = randomBytes(24).toString("base64url");
  const users = [];
  for (const suffix of ["a", "b"]) {
    const email = `eventloom-qa-${randomBytes(8).toString("hex")}-${suffix}@example.invalid`;
    const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
    assert.equal(error, null, "Temporary account creation failed");
    created.push(data.user.id); users.push({ email });
  }
  browser = await chromium.launch();
  const pages = [];
  for (const user of users) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`${baseURL}/auth/sign-in`);
    await page.getByLabel("Email address", { exact: true }).fill(user.email);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await page.waitForURL("**/dashboard");
    await page.getByText("Your private account workspace", { exact: true }).waitFor();
    pages.push(page);
  }
  checks.push("Two independent accounts signed in through the UI");
  const brief = JSON.parse(await readFile("tests/fixtures/event-input.json", "utf8"));
  const plan = JSON.parse(await readFile("tests/fixtures/plan-output.json", "utf8"));
  const now = new Date().toISOString();
  const event = { id: "synthetic-account-check", brief, plan, source: "gemini", status: "planning", actualSpent: {}, completedTasks: [], vendorStatus: {}, createdAt: now, updatedAt: now };
  const saved = await pages[0].request.post(`${baseURL}/api/events`, { headers: { Origin: baseURL }, data: { event } });
  assert.equal(saved.status(), 200, "Owner event creation failed");
  const { version } = await saved.json();
  const foreign = await pages[1].request.get(`${baseURL}/api/events`);
  assert.deepEqual((await foreign.json()).events, []);
  const attack = await pages[1].request.delete(`${baseURL}/api/events`, { headers: { Origin: baseURL }, data: { id: event.id, version } });
  assert.equal(attack.status(), 409);
  checks.push("Event API blocks cross-account reads and deletion");
  if (process.argv.includes("--gemini")) {
    for (const eventType of ["wedding", "birthday", "community"]) {
      const liveBrief = { ...brief, eventType, eventDate: new Date(Date.now() + 180 * 86400000).toISOString().slice(0, 10), budgetMinor: eventType === "wedding" ? 30000000 : 1500000 };
      const response = await pages[0].request.post(`${baseURL}/api/plans`, { headers: { Origin: baseURL }, data: liveBrief, timeout: 90_000 });
      const result = await response.json();
      if (response.status() !== 200) { liveFailures.push({ mode: eventType, status: response.status(), code: result.error?.code }); continue; }
      assert.equal(result.data.currency, liveBrief.currency);
      assert.ok(result.data.estimatedTotalMinor <= liveBrief.budgetMinor);
      checks.push(`Live Gemini ${eventType} generation passed independent validation`);
      if (eventType === "birthday") {
        const refined = await pages[0].request.post(`${baseURL}/api/plans/refine`, { headers: { Origin: baseURL }, data: { event: result.effectiveEvent, currentPlan: result.data, instruction: "Make the activities quieter and add a thoughtful shared memory activity. Keep every hard constraint." }, timeout: 90_000 });
        if (refined.status() !== 200) liveFailures.push({ mode: "refine", status: refined.status(), code: (await refined.json()).error?.code });
        else checks.push("Live Gemini creative refinement passed independent validation");
      }
    }
  }
  await pages[0].goto(`${baseURL}/events/${event.id}`);
  await pages[0].getByRole("tab", { name: "Budget", exact: true }).click();
  const expense = pages[0].getByRole("spinbutton").first();
  await expense.fill("123.45");
  const savedExpense = pages[0].waitForResponse(response => response.url().endsWith("/api/events") && response.request().method() === "POST");
  await expense.press("Enter"); assert.equal((await savedExpense).status(), 200);
  await pages[0].reload();
  await pages[0].getByRole("tab", { name: "Budget", exact: true }).click();
  assert.equal(await pages[0].getByRole("spinbutton").first().inputValue(), "123.45");
  const stale = await pages[0].request.post(`${baseURL}/api/events`, { headers: { Origin: baseURL }, data: { event, version } });
  assert.equal(stale.status(), 409);
  const invalid = await pages[0].request.put(`${baseURL}/api/events`, { headers: { Origin: baseURL }, data: [{ invalid: true }] });
  assert.equal(invalid.status(), 400);
  checks.push("Cloud expenses survive reload; stale writes and invalid backups fail safely");
  await pages[0].goto(`${baseURL}/settings`);
  await pages[0].getByRole("button", { name: "Sign out", exact: true }).click();
  await pages[0].getByText("Guest workspace · Saved only in this browser", { exact: true }).waitFor();
  assert.equal((await pages[0].request.get(`${baseURL}/api/events`)).status(), 401);
  checks.push("Sign-out clears the cloud workspace and account API access");
  console.log(JSON.stringify({ passed: checks, liveFailures }));
  if (liveFailures.length) process.exitCode = 1;
} finally {
  await browser?.close();
  for (const id of created) {
    const { error } = await admin.auth.admin.deleteUser(id);
    assert.equal(error, null, `Temporary account cleanup failed: ${id}`);
  }
  await mkdir(".audit", { recursive: true });
  await writeFile(".audit/account-verification.json", JSON.stringify({ checks, liveFailures, cleanedTemporaryUsers: created.length }, null, 2));
}
