"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowUpRight, CalendarDays, MapPin, Users, Wallet, Pencil, Trash2, Sparkles, Info, Check, ArrowRight } from "lucide-react";
import { useEvents } from "@/hooks/use-events";
import { useEventPlanner } from "@/hooks/use-event-planner";
import { eventTypes } from "@/config/event-types";
import { money, dateLabel } from "@/lib/utils";
import type { SavedEvent } from "@/types/plan";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { StatusMessage } from "@/components/ui/status-message";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BudgetBreakdown } from "./budget-breakdown";
import { Itinerary } from "./itinerary";
import { Checklist } from "./checklist";
import { RefineForm } from "./refine-form";
import { DownloadReport } from "./event-report";
export function PlanResults({ id }: { id: string }) {
  const router = useRouter();
  const { events, update, remove } = useEvents();
  const event = events.find(item => item.id === id);
  const [saveError, setSaveError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const { run, pending, error } = useEventPlanner();
  if (!event) return <div className="empty-state"><CalendarDays size={32} /><h1>This celebration isn’t on this device.</h1><p>Events are stored in the browser where they were created.</p><Button asChild><Link href="/events">Back to your events</Link></Button></div>;
  const kind = eventTypes.find(item => item.value === event.brief.eventType)!;
  const current = event;
  async function change(patch: Partial<SavedEvent>) {
    setSaveError("");
    try { await update(id, patch, current.updatedAt); return true; }
    catch (failure) { setSaveError(failure instanceof Error ? failure.message : "This change couldn't be saved."); return false; }
  }
  async function generate() {
    if (current.plan && !window.confirm("Regenerate this plan? This replaces its ideas and clears task, vendor, and spending records. Download a report or export a backup first.")) return;
    const result = await run(current.brief);
    if (result) change({ plan: result.plan, brief: result.event, source: "gemini", completedTasks: [], actualSpent: {}, vendorStatus: {} });
  }
  async function deleteEvent() {
    try { await remove(id); router.push("/events"); }
    catch (failure) { setSaveError(failure instanceof Error ? failure.message : "This event couldn't be deleted."); setDeleting(false); }
  }
  return <div className="event-detail"><Link href="/events" className="back-link"><ArrowLeft size={15} />Back to your celebrations</Link><div className="event-detail-hero"><Image src={kind.image} alt="" fill loading="eager" fetchPriority="high" sizes="(max-width: 760px) 100vw, 80vw" /><div className="event-detail-hero-content"><span className="event-category">{kind.label}{event.source === "sample" ? " · SAMPLE PLAN" : event.source === "draft" ? " · DRAFT" : " · GEMINI PLAN"}</span><h1>{event.brief.title}</h1><div><span><CalendarDays size={14} />{dateLabel(event.brief.eventDate)}</span><span><MapPin size={14} />{event.brief.location}</span><span><Users size={14} />{event.brief.guestCount} guests</span></div></div></div>
  <div className="event-action-bar"><div className="event-status-control"><span className={`status-dot status-${event.status}`} /><Select aria-label="Event status" value={event.status} onChange={e => change({ status: e.target.value as SavedEvent["status"] })}><option value="planning">In the making</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option></Select></div><div><span className="detail-budget"><Wallet size={15} />{money(event.brief.budgetMinor, event.brief.currency)} budget</span><Button asChild variant="outline" size="sm"><Link href={"/planner?edit=" + event.id}><Pencil size={14} />Edit details</Link></Button><Button size="icon" variant="ghost" aria-label="Delete event" onClick={() => setDeleting(true)}><Trash2 size={16} /></Button></div></div>
  <div className="report-toolbar"><DownloadReport event={event} />{event.plan && <Button variant="outline" size="sm" disabled={pending} onClick={() => void generate()}><Sparkles size={15} />{pending ? "Regenerating…" : "Regenerate plan"}</Button>}</div>
  {pending && <StatusMessage kind="loading">Gemini is preparing a new plan. Your existing plan stays safe until a valid replacement is saved.</StatusMessage>}
  {saveError && <StatusMessage>{saveError}</StatusMessage>}{error && <StatusMessage>{error}</StatusMessage>}
  {!event.plan ? <div className="draft-panel"><span className="refine-icon"><Sparkles size={24} /></span><h2>Your idea is <em>safely tucked away.</em></h2><p>Generate a personalized budget, timeline, vendor checklist,<br />and a few ideas that make it yours.</p><Button disabled={pending} onClick={() => void generate()}><Sparkles size={16} />{pending ? "Weaving your plan…" : "Generate a plan with Gemini"}</Button><small>Event details are sent to Google Gemini. No private guest information is needed.</small></div> :
  <Tabs defaultValue="overview"><TabsList aria-label="Event planning sections"><TabsTrigger value="overview">The overview</TabsTrigger><TabsTrigger value="budget">Budget</TabsTrigger><TabsTrigger value="timeline">Timeline</TabsTrigger><TabsTrigger value="checklist">Preparation</TabsTrigger><TabsTrigger value="vendors">Vendors</TabsTrigger></TabsList>
  <TabsContent value="overview"><div className="plan-overview-grid"><section className="theme-section"><span className="eyebrow">THE FEELING WE’RE GOING FOR</span><h2>{event.plan.theme.name}</h2><p className="theme-description">{event.plan.summary}</p><div className="theme-palette">{event.plan.theme.palette.map(color => <div key={color}><span style={{ backgroundColor: color }} /><small>{color}</small></div>)}</div><p>{event.plan.theme.description}</p><h3 className="ideas-heading"><Sparkles size={17} /> A few thoughtful touches</h3><ul className="theme-ideas">{event.plan.theme.ideas.map(idea => <li key={idea}><Check size={15} />{idea}</li>)}</ul></section><aside className="plan-overview-aside"><div className="overview-brief"><span className="eyebrow">YOUR CELEBRATION, AT A GLANCE</span><div><CalendarDays size={16} /><span>The day<strong>{dateLabel(event.brief.eventDate)}</strong></span></div><div><MapPin size={16} /><span>The place<strong>{event.brief.location}</strong></span></div><div><Users size={16} /><span>The people<strong>{event.brief.guestCount} lovely guests</strong></span></div><div><Wallet size={16} /><span>The budget<strong>{money(event.brief.budgetMinor, event.brief.currency)}</strong></span></div></div><div className="brief-preferences"><span className="eyebrow">THOSE PERSONAL LITTLE DETAILS</span><div className="preference-tags">{event.brief.preferences.map(preference => <span key={preference}>{preference}</span>)}</div>{event.brief.exclusions.length > 0 && <p>Leaving out: {event.brief.exclusions.join(", ")}.</p>}</div></aside></div><div className="assumption-note"><Info size={18} /><div><strong>A little context before you start</strong>{[...event.plan.assumptions, ...event.plan.warnings].map((note, i) => <p key={i}>{note}</p>)}<p>All costs are estimates. Confirm local prices and availability before committing.</p></div></div><RefineForm event={event} onChange={change} /></TabsContent>
  <TabsContent value="budget"><BudgetBreakdown event={event} onChange={change} /></TabsContent><TabsContent value="timeline"><Itinerary event={event} /></TabsContent><TabsContent value="checklist"><Checklist event={event} onChange={change} /></TabsContent><TabsContent value="vendors"><Checklist event={event} onChange={change} vendorsOnly /></TabsContent></Tabs>}
  <div className="detail-bottom-links"><Link href="/events"><ArrowLeft size={14} />All your celebrations</Link><Link href="/planner">Another reason to gather <ArrowUpRight size={14} /></Link></div>
  <Dialog open={deleting} onOpenChange={setDeleting}><DialogContent><span className="eyebrow">A LITTLE HOUSEKEEPING</span><DialogTitle className="dialog-title">Let this event go?</DialogTitle><DialogDescription className="dialog-description">This removes the plan, spending records, and progress from this browser. This can’t be undone. Export a backup in Settings first if you want to keep a copy.</DialogDescription><div className="dialog-actions"><Button variant="outline" onClick={() => setDeleting(false)}>Keep the event</Button><Button variant="destructive" onClick={deleteEvent}>Delete event <ArrowRight size={15} /></Button></div></DialogContent></Dialog>
  </div>;
}
