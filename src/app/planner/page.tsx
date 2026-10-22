import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { EventForm } from "@/components/planner/event-form";
export const metadata = { title: "Create an event" };
export default function PlannerPage() { return <AppShell><Suspense fallback={<p role="status">Opening your planning notebook…</p>}><EventForm /></Suspense></AppShell>; }
