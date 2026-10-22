import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const { generateContent } = vi.hoisted(() => ({ generateContent: vi.fn() }));
vi.mock("@google/genai", () => ({ GoogleGenAI: class { models = { generateContent }; } }));
import { POST } from "@/app/api/plans/route";
import { POST as REFINE } from "@/app/api/plans/refine/route";
import brief from "../fixtures/event-input.json";
import plan from "../fixtures/plan-output.json";
const request = (body: unknown, token = "synthetic-access-token") => new Request("https://studio.example/api/plans", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
beforeEach(() => {
  vi.stubEnv("GEMINI_API_KEY", "synthetic-unit-key"); vi.stubEnv("EVENTLOOM_ACCESS_TOKEN", "synthetic-access-token");
  vi.stubEnv("UPSTASH_REDIS_REST_URL", ""); vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
});
afterEach(() => vi.unstubAllEnvs());
describe("route through provider and domain validators", () => {
  it.each(["wedding", "birthday", "community"])("passes personalized %s briefs and returns validated structured output", async eventType => {
    generateContent.mockResolvedValue({ text: JSON.stringify(plan) });
    const input = { ...brief, eventType };
    const response = await POST(request(input));
    expect(response.status).toBe(200);
    expect((await response.json()).effectiveEvent).toEqual(input);
    expect(generateContent.mock.calls[0][0].contents).toContain(eventType);
    expect(generateContent.mock.calls[0][0].contents).toContain(brief.preferences[0]);
  });
  it("validates a creative refinement through the full request path", async () => {
    generateContent.mockResolvedValue({ text: JSON.stringify(plan) });
    const response = await REFINE(request({ event: brief, currentPlan: plan, instruction: "More shared activities" }));
    expect(response.status).toBe(200);
    expect(generateContent.mock.calls[0][0].contents).toContain("More shared activities");
  });
  it("never returns invalid arithmetic as a successful plan", async () => {
    generateContent.mockResolvedValue({ text: JSON.stringify({ ...plan, estimatedTotalMinor: 1 }) });
    expect((await POST(request(brief))).status).toBe(502);
  });
  it("maps provider timeouts into a safe recoverable response", async () => {
    generateContent.mockRejectedValue(new DOMException("private details", "TimeoutError"));
    const response = await POST(request(brief));
    expect(response.status).toBe(504); expect(await response.text()).not.toContain("private details");
  });
  it("blocks generation before the provider when production safeguards are missing", async () => {
    vi.stubEnv("NODE_ENV", "production");
    expect((await POST(request(brief))).status).toBe(503);
    expect(generateContent).not.toHaveBeenCalled();
  });
});
