import { describe, expect, it } from "vitest";
import { eventInputSchema, futureEventSchema } from "@/lib/validation/event-input";
import event from "../fixtures/event-input.json";
describe("event trust boundary", () => {
  it("accepts a complete future brief", () => { expect(futureEventSchema.parse(event).title).toBe(event.title); });
  it.each([
    { guestCount: 0 }, { guestCount: 501 }, { guestCount: 1.5 }, { budgetMinor: -1 }, { budgetMinor: 1.5 },
    { currency: "XYZ" }, { eventDate: "2080-02-30" }, { timeZone: "Fake/Zone" },
    { preferences: Array(11).fill("extra") }, { exclusions: ["x".repeat(201)] }, { apiKey: "unexpected" },
  ])("rejects invalid fields before generation: %j", patch => { expect(eventInputSchema.safeParse({ ...event, ...patch }).success).toBe(false); });
  it("rejects past events for generation while allowing archived storage", () => {
    const past = { ...event, eventDate: "2020-01-01" };
    expect(eventInputSchema.safeParse(past).success).toBe(true);
    expect(futureEventSchema.safeParse(past).success).toBe(false);
  });
});
