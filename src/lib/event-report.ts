import type { SavedEvent } from "@/types/plan";
import { dateLabel, money, taskDueDate } from "./utils";

export function eventReport(event: SavedEvent) {
  const { brief, plan } = event;
  const spent = Object.values(event.actualSpent).reduce((sum, value) => sum + value, 0);
  const sections = [{ title: "Celebration brief", lines: [
    `${brief.eventType} | ${dateLabel(brief.eventDate)} | ${brief.timeZone}`,
    `${brief.location} | ${brief.guestCount} guests | Status: ${event.status}`,
    `Budget: ${money(brief.budgetMinor, brief.currency)} | Recorded spending: ${money(spent, brief.currency)}`,
    `Source: ${event.source === "sample" ? "Illustrative sample" : event.source === "gemini" ? "Google Gemini suggestions" : "Draft; no AI plan"}`,
    `Preferences: ${brief.preferences.join("; ") || "Not specified"}`,
    `Exclusions: ${brief.exclusions.join("; ") || "Not specified"}`,
  ] }];
  if (plan) sections.push(
    { title: "Theme & personalized ideas", lines: [plan.title, plan.summary, plan.theme.name, plan.theme.description, `Palette: ${plan.theme.palette.join(", ")}`, ...plan.theme.ideas] },
    { title: "Budget & expenses", lines: [
      ...plan.budgetItems.map(item => `${item.label}: estimate ${money(item.amountMinor, brief.currency)}; actual ${money(event.actualSpent[item.id] ?? 0, brief.currency)}. ${item.note}`),
      `Estimated total: ${money(plan.estimatedTotalMinor, brief.currency)}`,
      `${spent > brief.budgetMinor ? "Over budget" : "Remaining budget"}: ${money(Math.abs(brief.budgetMinor - spent), brief.currency)}`,
    ] },
    { title: "Event-day timeline", lines: plan.itinerary.map(item => `${item.time} (${item.durationMinutes} min) - ${item.title}. ${item.description}`) },
    { title: "Preparation checklist", lines: plan.checklist.map(item => `${event.completedTasks.includes(item.id) ? "Done" : "To do"}: ${item.title} | Due ${taskDueDate(brief.eventDate, item.daysBefore)} (${item.daysBefore} days before).`) },
    { title: "Vendor checklist", lines: plan.vendorChecklist.flatMap(item => [`${item.category} | ${event.vendorStatus[item.id] ?? "todo"}. ${item.description}`, ...item.questions.map(question => `Ask: ${question}`)]) },
    { title: "Assumptions & warnings", lines: [...plan.assumptions, ...plan.warnings] },
  );
  sections.push({ title: "Before you book", lines: ["All costs and recommendations are estimates. Confirm prices, availability, accessibility, safety and local requirements with your venue and vendors. No bookings are made by EventLoom AI.", `Last updated: ${event.updatedAt}. Keep a JSON backup for recovery.`] });
  return sections;
}
