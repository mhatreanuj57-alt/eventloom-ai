import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("@/services/ai/generate-plan", () => ({ generatePlan: vi.fn() }));
vi.mock("@/services/ai/refine-plan", () => ({ refinePlan: vi.fn() }));
import { POST } from "@/app/api/plans/refine/route";
import { refinePlan } from "@/services/ai/refine-plan";
import brief from "../fixtures/event-input.json";
import fixture from "../fixtures/plan-output.json";
const request = (body: unknown) => new Request("http://localhost/api/plans/refine", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
beforeEach(() => { vi.stubEnv("EVENTLOOM_ACCESS_TOKEN", ""); });
describe("refinement route", () => {
  it("returns the effective brief for the next revision", async () => {
    vi.mocked(refinePlan).mockResolvedValue(fixture as Awaited<ReturnType<typeof refinePlan>>);
    const response = await POST(request({ event: brief, currentPlan: fixture, instruction: "A softer theme" }));
    expect(response.status).toBe(200); expect((await response.json()).effectiveEvent).toEqual(brief);
  });
  it("rejects a tampered plan before contacting Gemini", async () => {
    const response = await POST(request({ event: brief, currentPlan: { ...fixture, budgetMinor: 1 }, instruction: "A new theme" }));
    expect(response.status).toBe(400); expect(refinePlan).not.toHaveBeenCalled();
  });
  it("rejects an empty revision instruction", async () => {
    expect((await POST(request({ event: brief, currentPlan: fixture, instruction: " " }))).status).toBe(400);
    expect(refinePlan).not.toHaveBeenCalled();
  });
});
