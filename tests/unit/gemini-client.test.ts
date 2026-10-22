import { beforeEach, describe, expect, it, vi } from "vitest";
const { generateContent } = vi.hoisted(() => ({ generateContent: vi.fn() }));
vi.mock("@google/genai", () => ({ GoogleGenAI: class { models = { generateContent }; } }));
import { requestGemini } from "@/services/ai/gemini-client";
beforeEach(() => { vi.stubEnv("GEMINI_API_KEY", "synthetic-unit-test-key"); });
describe("Gemini boundary", () => {
  it("requires a server credential and never silently returns a sample", async () => {
    vi.stubEnv("GEMINI_API_KEY", "");
    await expect(requestGemini("brief")).rejects.toMatchObject({ status: 503, code: "AI_NOT_CONFIGURED" });
    expect(generateContent).not.toHaveBeenCalled();
  });
  it("requests JSON and parses provider text", async () => {
    generateContent.mockResolvedValue({ text: '{"test":true}' });
    await expect(requestGemini("brief")).resolves.toEqual({ test: true });
    expect(generateContent).toHaveBeenCalledWith(expect.objectContaining({ config: expect.objectContaining({ responseMimeType: "application/json", responseJsonSchema: expect.any(Object) }) }));
    const schema = generateContent.mock.calls[0][0].config.responseJsonSchema;
    expect(schema.properties.budgetItems.items.properties.amountMinor.type).toBe("integer");
    expect(schema.properties.currency.enum).toContain("INR");
    expect(schema.properties.theme.properties.palette.items.description).toContain("#3D4B36");
    expect(schema.required).toContain("vendorChecklist");
    expect(JSON.stringify(schema)).not.toMatch(/"\$schema"|"additionalProperties"|"pattern"/);
  });
  it.each([[429, "RATE_LIMITED"], [500, "AI_UNAVAILABLE"], [401, "AI_UNAVAILABLE"]])("redacts provider errors (%s)", async (status, code) => {
    generateContent.mockRejectedValue({ status, message: "private provider internals" });
    await expect(requestGemini("brief")).rejects.toMatchObject({ code });
  });
  it("rejects incomplete JSON", async () => {
    generateContent.mockResolvedValue({ text: '{"unfinished":' });
    await expect(requestGemini("brief")).rejects.toMatchObject({ status: 502 });
  });
});
