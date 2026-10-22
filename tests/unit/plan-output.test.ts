import { describe, expect, it } from "vitest";
import { validatePlanOutput, savedEventsSchema } from "@/lib/validation/plan-output";
import { eventInputSchema } from "@/lib/validation/event-input";
import { sampleEvents } from "@/lib/sample-events";
import brief from "../fixtures/event-input.json";
import fixture from "../fixtures/plan-output.json";
const event = eventInputSchema.parse(brief);
describe("plan validation", () => {
  it("accepts the synthetic fixture and all sample events", () => {
    expect(validatePlanOutput(fixture, event)).toEqual(fixture);
    expect(savedEventsSchema.parse(sampleEvents)).toHaveLength(3);
  });
  it("rejects incorrect arithmetic, excess budget, and currency changes", () => {
    for (const patch of [{ estimatedTotalMinor: 1 }, { budgetMinor: event.budgetMinor + 1 }, { currency: "USD" }]) expect(() => validatePlanOutput({ ...fixture, ...patch }, event)).toThrow();
  });
  it("rejects duplicated identifiers and overlapping times", () => {
    const duplicate = structuredClone(fixture); duplicate.budgetItems[1].id = duplicate.budgetItems[0].id;
    expect(() => validatePlanOutput(duplicate, event)).toThrow();
    const overlap = structuredClone(fixture); overlap.itinerary[1].time = "16:15";
    expect(() => validatePlanOutput(overlap, event)).toThrow();
  });
  it("rejects missing vendor guidance, negative costs, and unsafe palette values", () => {
    expect(() => validatePlanOutput({ ...fixture, vendorChecklist: [] }, event)).toThrow();
    const invalid = structuredClone(fixture); invalid.budgetItems[0].amountMinor = -1;
    expect(() => validatePlanOutput(invalid, event)).toThrow();
    expect(() => validatePlanOutput({ ...fixture, theme: { ...fixture.theme, palette: ["url(javascript:alert(1))"] } }, event)).toThrow();
  });
});
