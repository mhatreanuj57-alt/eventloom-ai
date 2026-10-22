"use client";
import { Check, ClipboardList, Store } from "lucide-react";
import type { SavedEvent } from "@/types/plan";
import { taskDueDate, dateInZone } from "@/lib/utils";
import { Select } from "@/components/ui/select";
export function Checklist({ event, onChange, vendorsOnly = false }: { event: SavedEvent; onChange: (patch: Partial<SavedEvent>) => void; vendorsOnly?: boolean }) {
  const plan = event.plan;
  if (!plan) return <div className="empty-state"><ClipboardList size={28} /><h3>The little details, all in one place.</h3><p>Generate a plan to build preparation and vendor checklists.</p></div>;
  const today = dateInZone(event.brief.timeZone);
  function due(days: number) {
    const eventDay = new Date(event.brief.eventDate + "T12:00:00Z");
    eventDay.setUTCDate(eventDay.getUTCDate() - days);
    return eventDay.toISOString().slice(0, 10) < today ? "Start now" : taskDueDate(event.brief.eventDate, days);
  }
  return <section><div className="detail-section-header"><div><span className="eyebrow">{vendorsOnly ? "GOOD PEOPLE MAKE GREAT GATHERINGS" : "ONE THOUGHTFUL STEP AT A TIME"}</span><h2>{vendorsOnly ? <>Find your <em>dream team.</em></> : <>The details, <em>taken care of.</em></>}</h2></div><span className="soft-badge">{vendorsOnly ? plan.vendorChecklist.length + " vendor categories" : event.completedTasks.length + " of " + plan.checklist.length + " complete"}</span></div>
  {!vendorsOnly && <div className="preparation-list">{plan.checklist.map(task => { const done = event.completedTasks.includes(task.id); return <label key={task.id} className={`task-row ${done ? "task-done" : ""}`}><input type="checkbox" checked={done} onChange={() => onChange({ completedTasks: done ? event.completedTasks.filter(id => id !== task.id) : [...event.completedTasks, task.id] })} /><span className="task-checkbox">{done && <Check size={14} />}</span><span>{task.title}</span><small>{due(task.daysBefore)}</small></label>; })}</div>}
  {vendorsOnly && <><p className="muted text-sm mb-6">A useful starting point, not a vendor directory. Confirm quotes and availability yourself. Status changes are your own records.</p><div className="vendor-grid">{plan.vendorChecklist.map(vendor => <article className="vendor-item" key={vendor.id}><div className="vendor-item-heading"><span className="vendor-icon"><Store size={19} /></span><h3>{vendor.category}</h3></div><p>{vendor.description}</p><ul>{vendor.questions.map(question => <li key={question}>{question}</li>)}</ul><label className="vendor-status-label">Your progress<Select aria-label={"Status for " + vendor.category} value={event.vendorStatus[vendor.id] ?? "todo"} onChange={e => onChange({ vendorStatus: { ...event.vendorStatus, [vendor.id]: e.target.value as "todo" | "contacted" | "booked" } })}><option value="todo">To explore</option><option value="contacted">Contacted</option><option value="booked">Booked by you</option></Select></label></article>)}</div></>}
  </section>;
}
