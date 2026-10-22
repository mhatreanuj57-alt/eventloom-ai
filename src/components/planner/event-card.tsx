import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Users, ArrowUpRight } from "lucide-react";
import { dateLabel } from "@/lib/utils";
import { eventTypes } from "@/config/event-types";
import type { SavedEvent } from "@/types/plan";
export function EventCard({ event }: { event: SavedEvent }) {
  const kind = eventTypes.find(type => type.value === event.brief.eventType)!;
  const progress = event.plan ? Math.round(event.completedTasks.length / event.plan.checklist.length * 100) : 0;
  return <article className="event-card"><Link href={`/events/${event.id}`} className="event-card-link"><div className="event-card-photo"><Image src={kind.image} alt="" fill loading="eager" sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw" /><span className="event-category">{kind.label}</span><span className="event-card-open"><ArrowUpRight size={17} /></span></div><div className="event-card-body"><div className="card-status"><span className={`status-dot status-${event.status}`} />{event.status === "planning" ? "In the making" : event.status === "confirmed" ? "All coming together" : "A lovely memory"}{event.source === "sample" && <span className="sample-label">SAMPLE</span>}{event.source === "draft" && <span className="sample-label">DRAFT</span>}</div><h3>{event.brief.title}</h3><div className="event-meta"><span><CalendarDays size={13} />{dateLabel(event.brief.eventDate)}</span><span><Users size={13} />{event.brief.guestCount} guests</span></div><div className="event-location"><MapPin size={13} />{event.brief.location}</div><div className="event-progress"><div><span>{event.plan ? "A little closer to the day" : "Your ideas are safely saved"}</span><strong>{progress}%</strong></div><div className="progress-track"><span style={{ width: progress + "%" }} /></div></div></div></Link></article>;
}
