import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("@/services/ai/generate-plan", () => ({ generatePlan: vi.fn() }));
vi.mock("@/services/ai/refine-plan", () => ({ refinePlan: vi.fn() }));
import { POST } from "@/app/api/plans/route";
import { generatePlan } from "@/services/ai/generate-plan";
import brief from "../fixtures/event-input.json";
import plan from "../fixtures/plan-output.json";
const request = (body: unknown, headers: Record<string, string> = {}) => new Request("http://localhost/api/plans", { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: typeof body === "string" ? body : JSON.stringify(body) });
beforeEach(() => { vi.stubEnv("EVENTLOOM_ACCESS_TOKEN", ""); });
afterEach(() => vi.unstubAllEnvs());
describe("generation route", () => {
  it("returns a validated plan envelope", async () => {
    vi.mocked(generatePlan).mockResolvedValue(plan as Awaited<ReturnType<typeof generatePlan>>);
    const response = await POST(request(brief)); const result = await response.json();
    expect(response.status).toBe(200); expect(result.effectiveEvent).toEqual(brief); expect(result.requestId).toBeTruthy();
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
  it.each([[{ ...brief, guestCount: 0 }, 400], ["{broken", 400], ["x".repeat(65537), 413]])("rejects malformed or oversized input", async (body, status) => {
    expect((await POST(request(body))).status).toBe(status); expect(generatePlan).not.toHaveBeenCalled();
  });
  it("rejects unsupported media and foreign origins", async () => {
    expect((await POST(request(brief, { "Content-Type": "text/plain" }))).status).toBe(415);
    expect((await POST(request(brief, { Origin: "https://evil.example" }))).status).toBe(403);
    expect(generatePlan).not.toHaveBeenCalled();
  });
  it("checks a configured studio token", async () => {
    vi.stubEnv("EVENTLOOM_ACCESS_TOKEN", "test-studio-token");
    expect((await POST(request(brief))).status).toBe(401);
    vi.mocked(generatePlan).mockResolvedValue(plan as Awaited<ReturnType<typeof generatePlan>>);
    expect((await POST(request(brief, { Authorization: "Bearer test-studio-token" }))).status).toBe(200);
  });
  it("does not expose unexpected errors", async () => {
    vi.mocked(generatePlan).mockRejectedValue(new Error("private-secret-value"));
    const response = await POST(request(brief));
    expect(response.status).toBe(500); expect(await response.text()).not.toContain("private-secret-value");
  });
});
