import { z } from "zod";
import type { EventBrief } from "@/types/event";
import { eventInputSchema } from "./event-input";
const text = z.string().trim().min(1).max(600);
const id = z.string().regex(/^[a-zA-Z0-9_-]{1,50}$/);
const amount = z.number().int().min(0).max(10_000_000_000);
export const planSchema = z.object({
  title: text,
  summary: text,
  currency: z.enum(["INR", "USD", "EUR", "GBP"]),
  budgetMinor: amount,
  estimatedTotalMinor: amount,
  theme: z.object({ name: text, description: text, palette: z.array(z.string().regex(/^#[0-9a-fA-F]{6}$/).describe("A color value ONLY, exactly # followed by six hexadecimal digits. Examples: #3D4B36, #F5EAE2, #FFFFFF. No names, spaces, labels or shorthand.")).min(3).max(5), ideas: z.array(text).min(2).max(6) }).strict(),
  budgetItems: z.array(z.object({ id, label: text, amountMinor: amount, note: text }).strict()).min(1).max(12),
  itinerary: z.array(z.object({ id, time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).describe("Zero-padded 24-hour local time HH:mm, for example 09:00 or 16:30; no AM/PM or date."), durationMinutes: z.number().int().min(1).max(480), title: text, description: text }).strict()).min(1).max(12),
  checklist: z.array(z.object({ id, title: text, daysBefore: z.number().int().min(0).max(365) }).strict()).min(1).max(16),
  vendorChecklist: z.array(z.object({ id, category: text, description: text, questions: z.array(text).min(1).max(5) }).strict()).min(1).max(8),
  assumptions: z.array(text).max(8),
  warnings: z.array(text).max(8),
}).strict();
export function validatePlanOutput(value: unknown, event: EventBrief) {
  const plan = planSchema.parse(value);
  const total = plan.budgetItems.reduce((sum, item) => sum + item.amountMinor, 0);
  if (!Number.isSafeInteger(total) || total !== plan.estimatedTotalMinor || total > event.budgetMinor || plan.budgetMinor !== event.budgetMinor || plan.currency !== event.currency) {
    throw new Error("Plan budget does not match the event constraints.");
  }
  for (const items of [plan.budgetItems, plan.itinerary, plan.checklist, plan.vendorChecklist]) {
    if (new Set(items.map(item => item.id)).size !== items.length) throw new Error("Plan item identifiers must be unique.");
  }
  let previousEnd = -1;
  for (const activity of plan.itinerary) {
    const [hours, minutes] = activity.time.split(":").map(Number);
    const start = hours * 60 + minutes;
    if (start < previousEnd || start + activity.durationMinutes > 1440) throw new Error("Plan activities overlap or extend beyond the event day.");
    previousEnd = start + activity.durationMinutes;
  }
  return plan;
}
export const savedEventSchema = z.object({
  id: z.string().regex(/^[a-zA-Z0-9_-]{1,100}$/),
  brief: eventInputSchema,
  plan: planSchema.nullable(),
  source: z.enum(["sample", "gemini", "draft"]),
  status: z.enum(["planning", "confirmed", "completed"]),
  completedTasks: z.array(z.string().max(50)).max(50),
  vendorStatus: z.record(z.string().max(50), z.enum(["todo", "contacted", "booked"])),
  actualSpent: z.record(z.string().max(50), amount),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict().superRefine((event, ctx) => {
  if (event.plan) {
    try { validatePlanOutput(event.plan, event.brief); }
    catch { ctx.addIssue({ code: "custom", message: "Saved plan is invalid." }); }
  }
  const tasks = new Set(event.plan?.checklist.map(item => item.id));
  const vendors = new Set(event.plan?.vendorChecklist.map(item => item.id));
  const expenses = new Set(event.plan?.budgetItems.map(item => item.id));
  if (new Set(event.completedTasks).size !== event.completedTasks.length || event.completedTasks.some(id => !tasks.has(id)) || Object.keys(event.vendorStatus).some(id => !vendors.has(id)) || Object.keys(event.actualSpent).some(id => !expenses.has(id))) {
    ctx.addIssue({ code: "custom", message: "Progress records must belong to the saved plan." });
  }
});
export const savedEventsSchema = z.array(savedEventSchema).max(50).refine(events => new Set(events.map(event => event.id)).size === events.length, "Event identifiers must be unique.");
