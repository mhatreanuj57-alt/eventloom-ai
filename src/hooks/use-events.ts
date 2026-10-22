"use client";
import { useSyncExternalStore } from "react";
import { savedEventsSchema } from "@/lib/validation/plan-output";
import { sampleEvents } from "@/lib/sample-events";
import type { SavedEvent } from "@/types/plan";
import { STORAGE_KEY as KEY, STORAGE_CHANGE as CHANGE, writeEvents } from "@/lib/event-storage";
import { useCloudWorkspace } from "@/components/auth/account-provider";
const initial = { events: sampleEvents, warning: "", isExample: true };
const unavailable = { events: [] as SavedEvent[], warning: "Browser storage is unavailable or unreadable. Saved data has not been overwritten; export a backup in Settings before starting fresh.", isExample: false };
let previous: string | null | undefined;
let snapshot = initial;
function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === previous) return snapshot;
    previous = raw;
    if (raw === null) { snapshot = initial; return snapshot; }
    const parsed = savedEventsSchema.safeParse(JSON.parse(raw));
    snapshot = parsed.success
      ? { events: parsed.data, warning: "", isExample: parsed.data.length > 0 && parsed.data.every(event => event.source === "sample") }
      : { events: [], warning: "Your saved events couldn't be read. They have not been overwritten. Export a backup in Settings before starting fresh.", isExample: false };
  } catch { snapshot = unavailable; }
  return snapshot;
}
function subscribe(callback: () => void) {
  window.addEventListener(CHANGE, callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener(CHANGE, callback); window.removeEventListener("storage", callback); };
}
export function useEvents() {
  const cloud = useCloudWorkspace();
  const state = useSyncExternalStore(subscribe, read, () => initial);
  function latest() {
    const current = read();
    if (current.warning) throw new Error(current.warning);
    return current;
  }
  function upsert(event: SavedEvent, expectedUpdatedAt?: string) {
    const current = latest();
    if (expectedUpdatedAt && current.events.find(item => item.id === event.id)?.updatedAt !== expectedUpdatedAt) throw new Error("This event changed while you were editing. Reload it before saving.");
    const existing = current.isExample ? [] : current.events;
    writeEvents(existing.some(item => item.id === event.id) ? existing.map(item => item.id === event.id ? event : item) : [event, ...existing]);
  }
  function update(id: string, patch: Partial<SavedEvent>, expectedUpdatedAt?: string) {
    const current = latest();
    if (expectedUpdatedAt && current.events.find(item => item.id === id)?.updatedAt !== expectedUpdatedAt) throw new Error("This event changed while you were editing. Reload it before saving.");
    if (!current.events.some(event => event.id === id)) throw new Error("This event was removed in another tab. Refresh your workspace.");
    writeEvents(current.events.map(event => event.id === id ? { ...event, ...patch, updatedAt: new Date().toISOString() } : event));
  }
  function remove(id: string) {
    writeEvents(latest().events.filter(event => event.id !== id));
  }
  return cloud ?? { ...state, loading: false, saving: false, upsert: async (event: SavedEvent, expectedUpdatedAt?: string) => upsert(event, expectedUpdatedAt), update: async (id: string, patch: Partial<SavedEvent>, expectedUpdatedAt?: string) => update(id, patch, expectedUpdatedAt), remove: async (id: string) => remove(id), restore: async (events: SavedEvent[]) => writeEvents(events), clear: async () => writeEvents([]), loadExamples: async () => writeEvents(sampleEvents), refresh: async () => {} };
}
let accessToken = "";
export function setAccessToken(value: string) { accessToken = value; }
export function getAccessToken() { return accessToken; }
