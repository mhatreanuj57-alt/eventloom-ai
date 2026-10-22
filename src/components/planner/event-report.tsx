"use client";
import Link from "next/link";
import { useState } from "react";
import { Download, Printer } from "lucide-react";
import { useEvents } from "@/hooks/use-events";
import { eventReport } from "@/lib/event-report";
import { Button } from "@/components/ui/button";
import { StatusMessage } from "@/components/ui/status-message";
import type { SavedEvent } from "@/types/plan";

export function DownloadReport({ event }: { event: SavedEvent }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function download() {
    setPending(true); setError("");
    try { const { downloadEventPdf } = await import("@/lib/pdf-report"); await downloadEventPdf(event); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "The report couldn't be downloaded. Try the readable report instead."); }
    finally { setPending(false); }
  }
  return <div className="report-actions"><Button variant="outline" size="sm" disabled={pending} onClick={() => void download()}><Download size={15} />{pending ? "Preparing PDF…" : "Download PDF"}</Button><Link className="text-link" href={`/events/${event.id}/report`}>Readable report</Link>{error && <StatusMessage>{error}</StatusMessage>}<span role="status" className="sr-only">{pending ? "Preparing your PDF report" : ""}</span></div>;
}

export function EventReport({ id }: { id: string }) {
  const { events } = useEvents();
  const event = events.find(item => item.id === id);
  if (!event) return <div className="empty-state"><h1>This event isn’t on this device.</h1><Link href="/events">Back to events</Link></div>;
  return <article className="readable-report"><div className="no-print"><Link className="back-link" href={`/events/${id}`}>Back to event</Link><div className="report-toolbar"><DownloadReport event={event} /><Button variant="outline" size="sm" onClick={() => window.print()}><Printer size={15} />Print / Save as PDF</Button></div></div><p className="eyebrow">EVENTLOOM AI / CELEBRATION REPORT</p><h1>{event.brief.title}</h1>{eventReport(event).map(section => <section key={section.title}><h2>{section.title}</h2>{section.lines.map((line, index) => <p key={index}>{line}</p>)}</section>)}</article>;
}
