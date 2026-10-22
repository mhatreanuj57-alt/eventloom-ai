"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Wallet, ListChecks } from "lucide-react";
import { useEvents } from "@/hooks/use-events";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StatusMessage } from "@/components/ui/status-message";
import { BudgetBreakdown } from "./budget-breakdown";
import { Checklist } from "./checklist";
import type { SavedEvent } from "@/types/plan";
export function ManagementView({ mode }: { mode: "budget" | "checklist" }) {
  const { events, update } = useEvents();
  const [selectedId, setSelectedId] = useState("");
  const [error, setError] = useState("");
  const current = events.find(event => event.id === selectedId) ?? events[0];
  async function change(patch: Partial<SavedEvent>) {
    if (!current) return;
    try { await update(current.id, patch, current.updatedAt); setError(""); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "This change couldn't be saved."); }
  }
  return <><div className="page-heading"><div><span className="eyebrow">{mode === "budget" ? "GOOD PLANS LEAVE A LITTLE WIGGLE ROOM" : "THE LITTLE THINGS MAKE THE DAY"}</span><h1>{mode === "budget" ? <>A little clarity. <em>A lot less guesswork.</em></> : <>One detail closer to <em>something lovely.</em></>}</h1><p>{mode === "budget" ? "Keep the estimates and the real numbers in the same thoughtful place." : "Preparation, one manageable step at a time."}</p></div></div>{current ? <><div className="management-picker"><label htmlFor="selected-event">YOUR CELEBRATION</label><Select id="selected-event" value={current.id} onChange={e => setSelectedId(e.target.value)}>{events.map(event => <option key={event.id} value={event.id}>{event.brief.title}</option>)}</Select><Link href={"/events/" + current.id}>Open event <ArrowUpRight size={15} /></Link></div>{error && <StatusMessage>{error}</StatusMessage>}<div className="management-surface">{mode === "budget" ? <BudgetBreakdown key={current.id} event={current} onChange={change} /> : <Checklist event={current} onChange={change} />}</div></> : <div className="empty-state">{mode === "budget" ? <Wallet size={32} /> : <ListChecks size={32} />}<h2>A little planning starts here.</h2><p>Create an event to get your details together.</p><Button asChild><Link href="/planner">Create an event <ArrowUpRight size={15} /></Link></Button></div>}</>;
}
