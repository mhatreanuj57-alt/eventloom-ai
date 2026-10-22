import { afterEach, describe, expect, it, vi } from "vitest";
import { parseBackup, writeEvents, STORAGE_KEY } from "@/lib/event-storage";
import { sampleEvents } from "@/lib/sample-events";
afterEach(() => vi.unstubAllGlobals());
describe("backup and persistence boundary", () => {
  it("round-trips complete sample workspaces", () => {
    expect(parseBackup(JSON.stringify(sampleEvents))).toEqual(sampleEvents);
  });
  it.each(["broken", "{}", "null", "x".repeat(4_000_001)])("rejects malformed, incompatible or oversized backups", raw => {
    expect(() => parseBackup(raw)).toThrow();
  });
  it("rejects duplicates, unsafe IDs and progress unrelated to a plan", () => {
    const event = sampleEvents[0];
    for (const invalid of [[event, event], [{ ...event, id: "../settings" }], [{ ...event, completedTasks: ["unrelated"] }], [{ ...event, actualSpent: { unrelated: 100 } }], Array(51).fill(event)]) {
      expect(() => parseBackup(JSON.stringify(invalid))).toThrow();
    }
  });
  it("does not write or announce changes when validation or storage fails", () => {
    const setItem = vi.fn(() => { throw new Error("QuotaExceededError"); });
    const dispatchEvent = vi.fn();
    vi.stubGlobal("localStorage", { setItem }); vi.stubGlobal("window", { dispatchEvent });
    expect(() => writeEvents(sampleEvents)).toThrow(/couldn't save/);
    expect(setItem).toHaveBeenCalledWith(STORAGE_KEY, expect.any(String));
    expect(dispatchEvent).not.toHaveBeenCalled();
  });
});
