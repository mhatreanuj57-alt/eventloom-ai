import { savedEventsSchema } from "./validation/plan-output";
import type { SavedEvent } from "@/types/plan";

export const STORAGE_KEY = "eventloom.events.v1";
export const STORAGE_CHANGE = "eventloom:change";
export function parseBackup(raw: string) {
  if (new TextEncoder().encode(raw).length > 4_000_000) throw new Error("Choose an EventLoom backup smaller than 4 MB.");
  const result = savedEventsSchema.safeParse((() => {
    try { return JSON.parse(raw); } catch { return null; }
  })());
  if (!result.success) throw new Error("This backup is invalid or incompatible. Your workspace has not been changed.");
  return result.data;
}
export function writeEvents(events: SavedEvent[]) {
  const checked = savedEventsSchema.safeParse(events);
  if (!checked.success) throw new Error("This change couldn't be saved. Check the event data and the 50-event workspace limit.");
  const raw = JSON.stringify(checked.data);
  if (new TextEncoder().encode(raw).length > 4_000_000) throw new Error("Your workspace is full. Export a backup and remove unused events before adding more.");
  try { localStorage.setItem(STORAGE_KEY, raw); }
  catch { throw new Error("Your browser couldn't save this change. Free up storage or allow local storage, then try again."); }
  window.dispatchEvent(new Event(STORAGE_CHANGE));
}
