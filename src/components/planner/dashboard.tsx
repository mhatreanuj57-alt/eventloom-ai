"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, Plus, CalendarDays, Users, CheckCheck, ArrowRight, Search, Asterisk, ListChecks } from "lucide-react";
import { useEvents } from "@/hooks/use-events";
import { EventCard } from "./event-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { dateLabel } from "@/lib/utils";
import { eventTypes } from "@/config/event-types";
export function Dashboard({ allEvents = false }: { allEvents?: boolean }) {
  const { events, isExample } = useEvents();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const filtered = events.filter(event => (filter === "all" || (filter === "upcoming" ? event.status !== "completed" : event.status === "completed")) && (event.brief.title + " " + event.brief.location).toLowerCase().includes(query.toLowerCase()));
  const upcoming = events.filter(event => event.status !== "completed").sort((a, b) => a.brief.eventDate.localeCompare(b.brief.eventDate));
  const featured = upcoming[0];
  const tasks = events.reduce((count, event) => count + event.completedTasks.length, 0);
  const totalTasks = events.reduce((count, event) => count + (event.plan?.checklist.length ?? 0), 0);
  return <>
    <div className="page-heading"><div><span className="eyebrow">{allEvents ? "YOUR CELEBRATION COLLECTION" : "A LITTLE SPACE FOR BIG IDEAS"}</span><h1>{allEvents ? <>Every occasion.<br className="mobile-break" /> <em>All together.</em></> : <>Good things are <em>taking shape.</em></>}</h1><p>{allEvents ? "From the first little idea to the last dance. Keep it all here." : "Welcome to your studio. Let’s make the next gathering a good one."}</p></div><Button asChild><Link href="/planner"><Plus size={17} />Create an event</Link></Button></div>
    {!allEvents && <><div className="studio-stats"><div><span className="stat-icon sage"><CalendarDays size={19} /></span><div><span>{isExample ? "Sample events" : "Upcoming events"}</span><strong>{upcoming.length}<small>occasions to look forward to</small></strong></div></div><div><span className="stat-icon peach"><Users size={19} /></span><div><span>{isExample ? "Sample guest count" : "People coming together"}</span><strong>{upcoming.reduce((sum, event) => sum + event.brief.guestCount, 0)}<small>across your upcoming events</small></strong></div></div><div><span className="stat-icon sand"><CheckCheck size={19} /></span><div><span>Details taken care of</span><strong>{tasks}<small>of {totalTasks} preparation tasks</small></strong></div></div></div>
    <div className="dashboard-feature-grid">{featured ? <Link className="featured-event" href={`/events/${featured.id}`}><Image src={eventTypes.find(item => item.value === featured.brief.eventType)!.image} alt="" fill loading="eager" fetchPriority="high" sizes="(max-width: 760px) 100vw, 55vw" /><div className="featured-top"><span className="featured-label"><span /> {isExample ? "A LITTLE INSPIRATION" : "NEXT ON YOUR CALENDAR"}</span><span className="featured-link"><ArrowUpRight size={21} /></span></div><div className="featured-bottom"><span>{dateLabel(featured.brief.eventDate, { day: "numeric", month: "long", year: "numeric" })} · {featured.brief.location}</span><h2>{featured.brief.title}</h2><div>{featured.plan?.theme.name ?? "An idea with a little room to grow."}<ArrowRight size={18} /></div></div></Link> : <div className="featured-empty"><Asterisk size={45} /><h2>A blank page.<br /><em>A beautiful possibility.</em></h2><p>Your next gathering starts with one little idea.</p><Button asChild><Link href="/planner">Create your first event <ArrowUpRight size={16} /></Link></Button></div>}
    <div className="planning-pulse"><div className="pulse-header"><span className="eyebrow">YOUR PLANNING PULSE</span><ListChecks size={19} /></div><h2>Little details.<br /><em>Lovely progress.</em></h2><p>No need to do it all at once.<br />One thoughtful step at a time.</p><div className="pulse-progress"><span>{tasks} of {totalTasks} tasks complete</span><strong>{totalTasks ? Math.round(tasks / totalTasks * 100) : 0}%</strong></div><div className="progress-track"><span style={{ width: (totalTasks ? tasks / totalTasks * 100 : 0) + "%" }} /></div><Link href="/checklist" className="pulse-link">A look at your checklists <ArrowUpRight size={16} /></Link></div></div></>}
    <section className="events-section"><div className="events-section-heading"><h2>{allEvents ? "Your events" : "Your celebration lineup"} <span>{events.length}</span></h2>{!allEvents && <Link href="/events" className="text-link">View all events <ArrowUpRight size={14} /></Link>}</div><div className="event-toolbar"><div className="filter-tabs" role="group" aria-label="Filter events">{[["all", "All events"], ["upcoming", "Upcoming"], ["completed", "Completed"]].map(([value, label]) => <button key={value} aria-pressed={filter === value} className={filter === value ? "selected" : ""} onClick={() => setFilter(value)}>{label}</button>)}</div><div className="search-field"><Search size={15} /><Input aria-label="Search events" placeholder="Find a little celebration…" value={query} onChange={event => setQuery(event.target.value)} /></div></div>
    {filtered.length ? <div className="event-grid">{filtered.map(event => <EventCard event={event} key={event.id} />)}</div> : <div className="empty-state"><CalendarDays size={30} /><h3>{query || filter !== "all" ? "No celebrations match just yet." : "Your next good memory starts here."}</h3><p>{query || filter !== "all" ? "Try a different search or filter." : "Create an event and make a little room for something wonderful."}</p><Button asChild variant="outline"><Link href="/planner">Create an event <Plus size={15} /></Link></Button></div>}
    </section>
    {!allEvents && <div className="studio-note"><Asterisk size={26} strokeWidth={1.2} /><p>The best celebrations aren’t perfect. <em>They’re personal.</em></p><Link href="/planner">Make yours <ArrowUpRight size={15} /></Link></div>}
  </>;
}
