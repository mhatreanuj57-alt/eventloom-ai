"use client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Sparkles, CalendarDays, MapPin, Users, Wallet, Heart, Cake, Trees, LoaderCircle, Save } from "lucide-react";
import { eventTypes, currencies } from "@/config/event-types";
import { useEvents } from "@/hooks/use-events";
import { useEventPlanner } from "@/hooks/use-event-planner";
import { eventInputSchema, futureEventSchema } from "@/lib/validation/event-input";
import { dateInZone, dateLabel, money } from "@/lib/utils";
import type { EventBrief, EventType, Currency } from "@/types/event";
import type { SavedEvent } from "@/types/plan";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StatusMessage } from "@/components/ui/status-message";

const occasionIcons = { wedding: Heart, birthday: Cake, community: Trees };
function Field({ label, htmlFor, error, children }: { label: string; htmlFor: string; error?: string; children: React.ReactNode }) {
  return <div className="form-field"><label htmlFor={htmlFor}>{label}</label>{children}{error && <p id={htmlFor + "-error"} className="field-error">{error}</p>}</div>;
}
export function EventForm() {
  const params = useSearchParams();
  const { events } = useEvents();
  const editing = params.get("edit");
  const initial = events.find(event => event.id === editing);
  const queryType = params.get("type");
  const kind = eventTypes.some(event => event.value === queryType) ? queryType as EventType : "wedding";
  if (editing && !initial) return <div className="empty-state"><h1>This event isn’t on this device.</h1><Button asChild><Link href="/events">Back to events</Link></Button></div>;
  return <Wizard key={editing ?? kind} initial={initial} kind={kind} />;
}
function Wizard({ initial: initialEvent, kind }: { initial?: SavedEvent; kind: EventType }) {
  const [initial] = useState(initialEvent);
  const router = useRouter();
  const { upsert } = useEvents();
  const { run, pending, error } = useEventPlanner();
  const [step, setStep] = useState(0);
  const [brief, setBrief] = useState<EventBrief>(initial?.brief ?? { title: "", eventType: kind, guestCount: 50, budgetMinor: 10000000, currency: "INR", eventDate: "", timeZone: "Asia/Kolkata", location: "", preferences: [], exclusions: [] });
  const [budget, setBudget] = useState(String(brief.budgetMinor / 100));
  const [preferences, setPreferences] = useState(brief.preferences.join(", "));
  const [exclusions, setExclusions] = useState(brief.exclusions.join(", "));
  const [fields, setFields] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => { formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(); }, [fields]);
  const selected = eventTypes.find(event => event.value === brief.eventType)!;
  function change<K extends keyof EventBrief>(name: K, value: EventBrief[K]) { setBrief(old => ({ ...old, [name]: value })); setFields(old => ({ ...old, [name]: "" })); }
  function build() {
    const pieces = budget.split(".");
    const budgetMinor = /^\d+(\.\d{1,2})?$/.test(budget) ? Number(pieces[0]) * 100 + Number((pieces[1] ?? "").padEnd(2, "0")) : NaN;
    return { ...brief, budgetMinor, preferences: preferences.split(",").map(value => value.trim()).filter(Boolean), exclusions: exclusions.split(",").map(value => value.trim()).filter(Boolean) };
  }
  function validate(onlyStep?: number, generate = true) {
    const result = (!generate && initial ? eventInputSchema : futureEventSchema).safeParse(build());
    if (result.success) { setFields({}); return result.data; }
    const visible = onlyStep === 0 ? ["title", "eventType"] : onlyStep === 1 ? ["guestCount", "budgetMinor", "currency", "eventDate", "timeZone", "location"] : null;
    const next: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const name = String(issue.path[0]);
      if (!visible || visible.includes(name)) next[name] ??= name === "budgetMinor" ? "Enter a budget from 1 to 100,000,000 with no more than two decimal places." : issue.message;
    }
    setFields(next);
    if (onlyStep === undefined && Object.keys(next).length) setStep(["title", "eventType"].some(key => next[key]) ? 0 : ["guestCount", "budgetMinor", "currency", "eventDate", "timeZone", "location"].some(key => next[key]) ? 1 : 2);
    return Object.keys(next).length ? null : build();
  }
  function next() { if (validate(step, !initial)) setStep(value => value + 1); }
  async function save(generate: boolean) {
    const valid = validate(undefined, generate);
    if (!valid) return;
    const detailsChanged = initial && Object.keys(valid).some(key => key !== "title" && JSON.stringify(valid[key as keyof EventBrief]) !== JSON.stringify(initial.brief[key as keyof EventBrief]));
    const keepPlan = !generate && !detailsChanged && !!initial?.plan;
    if (initial?.plan && !keepPlan && !window.confirm("Replacing this plan clears its preparation, vendor, and spending records. Export a backup in Settings first if needed. Continue?")) return;
    setSaveError("");
    let plan = keepPlan ? initial!.plan : null;
    let effective = valid;
    if (generate) {
      const result = await run(valid);
      if (!result) return;
      plan = result.plan; effective = result.event;
    }
    const now = new Date().toISOString();
    try {
      const saved: SavedEvent = {
        id: initial?.id ?? crypto.randomUUID(), brief: effective, plan,
        source: keepPlan ? initial!.source : plan ? "gemini" : "draft", status: initial?.status ?? "planning",
        completedTasks: keepPlan ? initial!.completedTasks : [], vendorStatus: keepPlan ? initial!.vendorStatus : {}, actualSpent: keepPlan ? initial!.actualSpent : {},
        createdAt: initial?.createdAt ?? now, updatedAt: now,
      };
      await upsert(saved, initial?.updatedAt); router.push("/events/" + saved.id);
    } catch (failure) { setSaveError(failure instanceof Error ? failure.message : "Your event couldn't be saved. Please try again."); }
  }
  const a11y = (name: string) => ({ "aria-invalid": !!fields[name], "aria-describedby": fields[name] ? name + "-error" : undefined });
  return <div className="wizard-page">
    <Link href={initial ? "/events/" + initial.id : "/dashboard"} className="back-link"><ArrowLeft size={15} /> {initial ? "Back to event" : "Back to your studio"}</Link>
    <div className="page-heading"><div><span className="eyebrow">{initial ? "A FEW THOUGHTFUL CHANGES" : "EVERY GOOD GATHERING STARTS SOMEWHERE"}</span><h1>{initial ? <>Make a little <em>adjustment.</em></> : <>Let’s make <em>something lovely.</em></>}</h1><p>A few details now. A celebration that feels like you.</p></div><span className="wizard-step-count">STEP 0{step + 1} / 03</span></div>
    <div className="wizard-layout"><div className="wizard-main"><ol className="wizard-steps" aria-label="Event creation progress">{["The occasion", "The details", "The little extras"].map((label, index) => <li key={label} className={index <= step ? "current" : ""} aria-current={step === index ? "step" : undefined}><span>{index < step ? <Check size={14} /> : index + 1}</span>{label}</li>)}</ol>
    <form ref={formRef} onSubmit={event => { event.preventDefault(); if (step < 2) next(); else void save(true); }} noValidate>
      <fieldset disabled={pending} className="wizard-fieldset">
      <div className="wizard-step-content" key={step}>
      {step === 0 && <><span className="eyebrow">FIRST THINGS FIRST</span><h2>What are we celebrating?</h2><p className="form-intro">Big milestones or small joys. Pick your kind of gathering.</p><div className="occasion-choices" role="group" aria-label="Event type">{eventTypes.map(type => { const Icon = occasionIcons[type.value]; return <button type="button" key={type.value} aria-pressed={brief.eventType === type.value} className={brief.eventType === type.value ? "occasion-choice selected" : "occasion-choice"} onClick={() => change("eventType", type.value)}><Icon size={25} strokeWidth={1.5} /><strong>{type.label}</strong><span>{type.description}</span>{brief.eventType === type.value && <Check size={14} className="choice-check" />}</button>; })}</div><Field label="Give it a little name" htmlFor="title" error={fields.title}><Input id="title" placeholder={brief.eventType === "wedding" ? "e.g. Aarav & Meera’s big day" : brief.eventType === "birthday" ? "e.g. A golden birthday" : "e.g. The neighborhood Sunday social"} maxLength={80} value={brief.title} onChange={event => change("title", event.target.value)} {...a11y("title")} autoComplete="off" /></Field></>}
      {step === 1 && <><span className="eyebrow">A LITTLE SHAPE, A LITTLE STRUCTURE</span><h2>Let’s gather the details.</h2><p className="form-intro">A starting point is all we need. You can change these later.</p><div className="form-grid"><Field label="When’s the occasion?" htmlFor="eventDate" error={fields.eventDate}><Input type="date" id="eventDate" min={dateInZone(brief.timeZone)} value={brief.eventDate} onChange={event => change("eventDate", event.target.value)} {...a11y("eventDate")} /></Field><Field label="How many people?" htmlFor="guestCount" error={fields.guestCount}><Input type="number" id="guestCount" min={1} max={500} step={1} value={brief.guestCount || ""} onChange={event => change("guestCount", Number(event.target.value))} {...a11y("guestCount")} /></Field><Field label="Your total budget" htmlFor="budgetMinor" error={fields.budgetMinor}><Input id="budgetMinor" type="number" min={1} max={100000000} step=".01" value={budget} onChange={event => setBudget(event.target.value)} {...a11y("budgetMinor")} /></Field><Field label="Currency" htmlFor="currency"><Select id="currency" value={brief.currency} onChange={event => change("currency", event.target.value as Currency)}>{currencies.map(currency => <option key={currency}>{currency}</option>)}</Select></Field><Field label="City or region" htmlFor="location" error={fields.location}><Input id="location" value={brief.location} placeholder="e.g. Pune, Maharashtra" maxLength={120} onChange={event => change("location", event.target.value)} {...a11y("location")} /></Field><Field label="Event time zone" htmlFor="timeZone" error={fields.timeZone}><Select id="timeZone" value={brief.timeZone} onChange={event => change("timeZone", event.target.value)}>{[["Asia/Kolkata","India · Kolkata"],["Europe/London","UK · London"],["Europe/Paris","Europe · Paris"],["America/New_York","US · New York"],["America/Los_Angeles","US · Los Angeles"],["Asia/Dubai","UAE · Dubai"],["Australia/Sydney","Australia · Sydney"]].map(([value,label]) => <option key={value} value={value}>{label}</option>)}</Select></Field></div></>}
      {step === 2 && <><span className="eyebrow">THIS IS THE PART THAT MAKES IT YOU</span><h2>A few personal touches.</h2><p className="form-intro">The mood, the menu, the must-haves. Tell us what matters.</p><Field label="The vibe & your preferences" htmlFor="preferences" error={fields.preferences}><Textarea id="preferences" value={preferences} onChange={event => setPreferences(event.target.value)} placeholder="e.g. Garden setting, vegetarian menu, step-free access, warm candlelight" {...a11y("preferences")} /><small className="field-hint">Separate ideas with commas. Up to 10 ideas, 200 characters each.</small></Field><Field label="Anything to leave out?" htmlFor="exclusions" error={fields.exclusions}><Input id="exclusions" value={exclusions} onChange={event => setExclusions(event.target.value)} placeholder="e.g. Loud music, single-use plastic, alcohol" {...a11y("exclusions")} /></Field><div className="ai-consent"><Sparkles size={20} /><div><strong>A little help from Gemini</strong><p>Your brief is sent to Google Gemini to create your plan. Leave out private guest details. Suggestions and costs are estimates, never confirmed vendor quotes.</p></div></div>{initial?.plan && <p className="field-hint">Saving only a name change keeps your plan and progress. Changes to planning details, or generating again, replace the plan and reset its trackers after confirmation.</p>}</>}
      </div>
      {Object.keys(fields).length > 0 && <StatusMessage>Check the highlighted fields before continuing.</StatusMessage>}
      {error && <StatusMessage>{error}</StatusMessage>}{saveError && <StatusMessage>{saveError}</StatusMessage>}
      {pending && <div className="generation-state" role="status"><span className="loading-flower">✳</span><strong>Weaving your ideas together…</strong><p>Thinking through the budget, timeline, and little details.<br />This can take up to a minute. Keep this page open.</p></div>}
      <div className="wizard-actions"><Button type="button" variant="ghost" onClick={() => setStep(value => value - 1)} disabled={step === 0 || pending}><ArrowLeft size={16} />Back</Button><div>{step === 2 && <Button type="button" variant="outline" onClick={() => void save(false)} disabled={pending}><Save size={15} />{initial ? "Save details" : "Save as draft"}</Button>}<Button type="submit" disabled={pending}>{pending ? <><LoaderCircle size={16} className="spin" />Weaving your plan</> : step === 2 ? <><Sparkles size={16} />Generate my plan</> : <>Continue <ArrowRight size={16} /></>}</Button></div></div>
      </fieldset>
    </form></div>
    <aside className="wizard-preview"><div className="wizard-preview-photo"><Image src={selected.image} alt="" fill loading="eager" sizes="(max-width: 900px) 100vw, 30vw" /><span className="event-category">YOUR NEXT {selected.label.toUpperCase()}</span></div><div className="wizard-preview-body"><span className="eyebrow">TAKING A LITTLE SHAPE</span><h3>{brief.title || "A lovely idea, in the making."}</h3><p>{selected.description}</p><ul><li><CalendarDays size={15} />{brief.eventDate ? dateLabel(brief.eventDate) : "A day to look forward to"}</li><li><Users size={15} />{brief.guestCount || 0} people, coming together</li><li><MapPin size={15} />{brief.location || "Somewhere special"}</li><li><Wallet size={15} />{Number(budget) > 0 ? money(Math.round(Number(budget) * 100), brief.currency) : "Your considered budget"}</li></ul><div className="preview-note"><span>✳</span> The best plans leave a little<br />room for the unexpected.</div></div></aside>
    </div>
  </div>;
}
