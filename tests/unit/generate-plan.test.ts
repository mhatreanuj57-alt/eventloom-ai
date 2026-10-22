import { describe, expect, it, vi } from "vitest";
vi.mock("@/services/ai/gemini-client", () => ({ requestGemini: vi.fn() }));
import { requestGemini } from "@/services/ai/gemini-client";
import { generatePlan } from "@/services/ai/generate-plan";
import { eventInputSchema } from "@/lib/validation/event-input";
import brief from "../fixtures/event-input.json";
import plan from "../fixtures/plan-output.json";
describe("generation service", () => {
  it("sends structured event data and validates the result", async () => {
    vi.mocked(requestGemini).mockResolvedValue(plan);
    await expect(generatePlan(eventInputSchema.parse(brief))).resolves.toEqual(plan);
    expect(requestGemini).toHaveBeenCalledWith(expect.stringContaining(brief.title));
  });
  it("fails safely rather than returning an invalid plan", async () => {
    vi.mocked(requestGemini).mockResolvedValue({ ...plan, estimatedTotalMinor: 0 });
    await expect(generatePlan(eventInputSchema.parse(brief))).rejects.toMatchObject({ status: 502, code: "INVALID_AI_RESPONSE" });
  });
});
