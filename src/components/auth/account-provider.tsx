"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { browserSupabase, supabaseConfigured } from "@/lib/supabase/client";
import { savedEventsSchema, savedEventSchema } from "@/lib/validation/plan-output";
import { sampleEvents } from "@/lib/sample-events";
import type { SavedEvent } from "@/types/plan";

type Account = { configured: boolean; user: User | null; loading: boolean; signOut: () => Promise<void> };
type Workspace = { events: SavedEvent[]; warning: string; isExample: boolean; loading: boolean; saving: boolean; upsert: (event: SavedEvent, expectedUpdatedAt?: string) => Promise<void>; update: (id: string, patch: Partial<SavedEvent>, expectedUpdatedAt?: string) => Promise<void>; remove: (id: string) => Promise<void>; restore: (events: SavedEvent[]) => Promise<void>; clear: () => Promise<void>; loadExamples: () => Promise<void>; refresh: () => Promise<void> };
const AccountContext = createContext<Account>({ configured: false, user: null, loading: false, signOut: async () => {} });
const WorkspaceContext = createContext<Workspace | null>(null);
export const useAccount = () => useContext(AccountContext);
export const useCloudWorkspace = () => useContext(WorkspaceContext);

async function api(method = "GET", body?: unknown) {
  const response = await fetch("/api/events", { method, headers: { "Content-Type": "application/json" }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}), cache: "no-store", signal: AbortSignal.timeout(20_000) });
  let result;
  try { result = await response.json(); } catch { throw new Error("Account storage returned an unreadable response. Please try again."); }
  if (!response.ok) throw new Error(result.error?.message || "Your account events couldn't be saved. Please try again.");
  return result;
}
export function AccountProvider({ children }: { children: React.ReactNode }) {
  const configured = supabaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(configured);
  const [saving, setSaving] = useState(false);
  const [events, setEvents] = useState<SavedEvent[]>([]);
  const [warning, setWarning] = useState("");
  const current = useRef({ userId: "", events: [] as SavedEvent[], versions: {} as Record<string, string>, busy: false, load: 0 });
  async function refresh() {
    const owner = current.current.userId;
    if (!owner || current.current.busy) return;
    const load = ++current.current.load;
    try {
      const data = await api();
      const checked = savedEventsSchema.parse(data.events);
      if (owner !== current.current.userId || load !== current.current.load) return;
      current.current.events = checked; current.current.versions = data.versions;
      setEvents(checked); setWarning("");
    } catch (failure) {
      if (owner === current.current.userId) setWarning(failure instanceof Error ? failure.message : "Your account events couldn't be loaded.");
    } finally { if (owner === current.current.userId && load === current.current.load) setLoading(false); }
  }
  useEffect(() => {
    if (!configured) return;
    const db = browserSupabase();
    let alive = true;
    const { data: { subscription } } = db.auth.onAuthStateChange((_event, session) => {
      if (!alive) return;
      const nextUser = session?.user ?? null;
      const changed = current.current.userId !== (nextUser?.id ?? "");
      setUser(nextUser);
      if (changed) {
        current.current = { userId: nextUser?.id ?? "", events: [], versions: {}, busy: false, load: current.current.load + 1 };
        setEvents([]); setWarning(""); setSaving(false);
      }
      if (nextUser) { if (changed) setLoading(true); queueMicrotask(() => { if (alive) void refresh(); }); }
      else setLoading(false);
    });
    const focus = () => { if (alive) void refresh(); };
    window.addEventListener("focus", focus);
    return () => { alive = false; subscription.unsubscribe(); window.removeEventListener("focus", focus); };
    // Auth subscription owns account changes; requests use the current owner ref.
  }, [configured]);

  async function mutate(work: () => Promise<void>, replacing = false) {
    if (current.current.busy) throw new Error("Another save is in progress. Please wait.");
    if (warning && !replacing) throw new Error("Reload your account workspace before making changes. " + warning);
    current.current.busy = true; current.current.load++; setSaving(true);
    const owner = current.current.userId;
    try { await work(); }
    finally { if (owner === current.current.userId) { current.current.busy = false; setSaving(false); } }
  }
  async function upsert(event: SavedEvent, expectedUpdatedAt?: string) {
    const existing = current.current.events.find(item => item.id === event.id);
    if (expectedUpdatedAt && existing?.updatedAt !== expectedUpdatedAt) throw new Error("This event changed while you were editing. Reload and review it before saving.");
    const checked = savedEventSchema.parse(event);
    await mutate(async () => {
      const owner = current.current.userId;
      const data = await api("POST", { event: checked, version: current.current.versions[event.id] });
      if (owner !== current.current.userId) return;
      current.current.versions[event.id] = data.version;
      current.current.events = current.current.events.some(item => item.id === event.id) ? current.current.events.map(item => item.id === event.id ? checked : item) : [checked, ...current.current.events];
      setEvents(current.current.events);
    });
  }
  async function update(id: string, patch: Partial<SavedEvent>, expectedUpdatedAt?: string) {
    const event = current.current.events.find(item => item.id === id);
    if (!event) throw new Error("This event isn't available. Reload the workspace.");
    await upsert({ ...event, ...patch, updatedAt: new Date().toISOString() }, expectedUpdatedAt);
  }
  async function remove(id: string) {
    await mutate(async () => {
      const owner = current.current.userId;
      await api("DELETE", { id, version: current.current.versions[id] });
      if (owner !== current.current.userId) return;
      current.current.events = current.current.events.filter(event => event.id !== id);
      delete current.current.versions[id]; setEvents(current.current.events);
    });
  }
  async function restore(items: SavedEvent[]) {
    savedEventsSchema.parse(items);
    await mutate(async () => { await api("PUT", items); }, true);
    await refresh();
  }
  async function signOut() {
    if (current.current.busy) throw new Error("Wait for your event to finish saving before signing out.");
    const { error } = await browserSupabase().auth.signOut();
    if (error) throw new Error("Sign out couldn't be completed. Please try again.");
  }
  const workspace = user ? { events, warning, loading, saving, isExample: events.length > 0 && events.every(event => event.source === "sample"), upsert, update, remove, restore, refresh, clear: () => restore([]), loadExamples: () => restore(sampleEvents) } : null;
  return <AccountContext.Provider value={{ configured, user, loading, signOut }}><WorkspaceContext.Provider value={workspace}>{children}</WorkspaceContext.Provider></AccountContext.Provider>;
}
