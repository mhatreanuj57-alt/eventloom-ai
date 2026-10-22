import { z } from "zod";
import { dateInZone } from "@/lib/utils";
export const calendarDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const date = new Date(value + "T12:00:00Z");
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, "Enter a real calendar date.");
export const eventInputSchema = z.object({
  title: z.string().trim().min(3, "Give your event a name (at least 3 characters).").max(80),
  eventType: z.enum(["wedding", "birthday", "community"]),
  guestCount: z.number().int().min(1).max(500),
  budgetMinor: z.number().int().min(100).max(10_000_000_000).refine(Number.isSafeInteger),
  currency: z.enum(["INR", "USD", "EUR", "GBP"]),
  eventDate: calendarDate,
  timeZone: z.string().min(1).max(80).refine(value => { try { new Intl.DateTimeFormat("en", { timeZone: value }); return true; } catch { return false; } }, "Choose a valid time zone."),
  location: z.string().trim().min(2, "Enter a city or region.").max(120),
  preferences: z.array(z.string().trim().min(1).max(200)).max(10),
  exclusions: z.array(z.string().trim().min(1).max(200)).max(10),
}).strict();
export const futureEventSchema = eventInputSchema.superRefine((event, context) => {
  try {
    if (event.eventDate < dateInZone(event.timeZone)) context.addIssue({ code: "custom", path: ["eventDate"], message: "Choose today or a future date in your event's time zone." });
  } catch { /* Invalid time zones already receive a field error. */ }
});
