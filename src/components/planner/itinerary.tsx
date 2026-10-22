import { Clock3, CalendarDays } from "lucide-react";
import type { SavedEvent } from "@/types/plan";
import { dateLabel } from "@/lib/utils";
export function Itinerary({ event }: { event: SavedEvent }) {
  if (!event.plan) return <div className="empty-state"><Clock3 size={28} /><h3>A day with a little breathing room.</h3><p>Generate a plan to create your celebration timeline.</p></div>;
  return <section><div className="detail-section-header"><div><span className="eyebrow">THE DAY, THOUGHTFULLY PACED</span><h2>A little room for <em>every moment.</em></h2></div></div><div className="timeline-date"><CalendarDays size={17} /><strong>{dateLabel(event.brief.eventDate)}</strong><span>{event.brief.timeZone} · Proposed schedule</span></div><ol className="itinerary">{event.plan.itinerary.map((activity, index) => <li key={activity.id}><div className="itinerary-time">{activity.time}<small>{activity.durationMinutes} min</small></div><span className="timeline-node">{String(index + 1).padStart(2, "0")}</span><div><h3>{activity.title}</h3><p>{activity.description}</p></div></li>)}</ol><p className="detail-disclaimer">A proposed local-time schedule. Confirm the final timings with your venue and vendors.</p></section>;
}
