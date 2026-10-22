"use client";
import { useState } from "react";
import { Sparkles, ArrowUpRight, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusMessage } from "@/components/ui/status-message";
import { useEventPlanner } from "@/hooks/use-event-planner";
import type { SavedEvent } from "@/types/plan";
export function RefineForm({ event, onChange }: { event: SavedEvent; onChange: (patch: Partial<SavedEvent>) => Promise<boolean> }) {
  const [instruction, setInstruction] = useState("");
  const { run, pending, error } = useEventPlanner();
  async function refine() {
    if (!event.plan || !instruction.trim() || pending) return;
    if ((event.completedTasks.length || Object.keys(event.actualSpent).length || Object.keys(event.vendorStatus).length) && !window.confirm("A new plan clears the current task, vendor, and spending records. Export a backup in Settings first if needed. Continue?")) return;
    const result = await run(event.brief, event.plan, instruction.trim());
    if (result && await onChange({ brief: result.event, plan: result.plan, source: "gemini", completedTasks: [], actualSpent: {}, vendorStatus: {} })) setInstruction("");
  }
  return <div className="refine-panel"><span className="refine-icon"><Sparkles size={21} /></span><div><h3>A little more you?</h3><p>Ask for quieter activities, a new theme, or more personal touches. Edit event details to change the date, guests, or budget.</p><form onSubmit={e => { e.preventDefault(); void refine(); }}><Textarea aria-label="How would you like to refine the plan?" placeholder="e.g. Make the celebration more outdoorsy and add a shared activity…" value={instruction} maxLength={1000} onChange={e => setInstruction(e.target.value)} disabled={pending} required /><div className="refine-actions"><small>A new plan resets task, vendor, and spending trackers.</small><Button type="submit" disabled={pending || !instruction.trim()} size="sm">{pending ? <><LoaderCircle size={15} className="spin" />Refining…</> : <>Refine with AI <ArrowUpRight size={15} /></>}</Button></div></form>{error && <StatusMessage>{error}</StatusMessage>}</div></div>;
}
