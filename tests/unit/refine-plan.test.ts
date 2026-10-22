import { describe, expect, it, vi } from "vitest";
vi.mock("@/services/ai/gemini-client", () => ({ requestGemini: vi.fn() }));
import { requestGemini } from "@/services/ai/gemini-client";
import { refinePlan } from "@/services/ai/refine-plan";
import { eventInputSchema } from "@/lib/validation/event-input";
import { planSchema } from "@/lib/validation/plan-output";
import brief from "../fixtures/event-input.json";
import fixture from "../fixtures/plan-output.json";
describe("refinement service", () => {
  it("carries the effective brief and prior plan into the next request", async () => {
    const next = { ...fixture, theme: { ...fixture.theme, name: "A quieter afternoon" } };
    vi.mocked(requestGemini).mockResolvedValue(next);
    await expect(refinePlan(eventInputSchema.parse(brief), planSchema.parse(fixture), "Quieter activities")).resolves.toEqual(next);
    expect(requestGemini).toHaveBeenCalledWith(expect.stringContaining('"instruction":"Quieter activities"'));
    expect(requestGemini).toHaveBeenCalledWith(expect.stringContaining('"budgetMinor":1500000'));
  });
  it("rejects a model that changes the hard budget", async () => {
    vi.mocked(requestGemini).mockResolvedValue({ ...fixture, budgetMinor: 100 });
    await expect(refinePlan(eventInputSchema.parse(brief), planSchema.parse(fixture), "A new theme")).rejects.toMatchObject({ status: 502 });
    expect(fixture.budgetMinor).toBe(1500000);
  });
});
