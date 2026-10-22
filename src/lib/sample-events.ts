import type { EventBrief } from "@/types/event";
import type { EventPlan, SavedEvent } from "@/types/plan";
export function samplePlan(event: EventBrief): EventPlan {
  const wedding = event.eventType === "wedding";
  const community = event.eventType === "community";
  const allocations = [35, 25, 15, 10, 5];
  const labels = ["Food & drinks", "Venue & setup", "Decor & flowers", "Photography", "Activities"];
  const items = allocations.map((share, i) => ({ id: "budget-" + i, label: labels[i], amountMinor: Math.floor(event.budgetMinor * share / 100), note: "Illustrative allocation. Confirm local quotes." }));
  const allocated = items.reduce((sum, item) => sum + item.amountMinor, 0);
  items.push({ id: "budget-5", label: "Contingency", amountMinor: event.budgetMinor - allocated, note: "Keep a little room for the unexpected." });
  return {
    title: event.title,
    summary: wedding ? "A warm, intimate celebration with thoughtful details, effortless hosting, and room for the moments that matter." : community ? "An easygoing gathering built around good conversations, shared food, and a little neighborhood magic." : "A joy-filled birthday with a playful palette, a relaxed afternoon, and all your favorite people.",
    currency: event.currency, budgetMinor: event.budgetMinor, estimatedTotalMinor: event.budgetMinor,
    theme: {
      name: wedding ? "A little wild, a lot of love" : community ? "Together, under the trees" : "Golden hour kind of joy",
      description: "Natural textures, seasonal details, warm light, and personal touches make the gathering feel like you.",
      palette: wedding ? ["#A5AA8D", "#E9DDCC", "#C58C68", "#FCF9F3"] : community ? ["#7A8C70", "#E3E8D9", "#D5A46D", "#FAF8F2"] : ["#DBB361", "#E9C3B3", "#9AAB93", "#FAF4E8"],
      ideas: ["A handwritten welcome note for every guest", "Seasonal flowers in small, reusable vessels", "A shared photo corner with a personal story"],
    },
    budgetItems: items,
    itinerary: [
      { id: "arrival", time: "16:00", durationMinutes: 30, title: "A warm welcome", description: "Welcome drinks, a gentle playlist, and time to settle in." },
      { id: "moment", time: "16:30", durationMinutes: 60, title: wedding ? "The ceremony" : community ? "Meet, mingle & make" : "Let the good times begin", description: wedding ? "Your personal ceremony, followed by a relaxed group photograph." : "A shared activity that brings everyone into the celebration." },
      { id: "food", time: "17:30", durationMinutes: 60, title: "Gather around the table", description: "A considered menu with clearly labeled dietary options." },
      { id: "memories", time: "18:30", durationMinutes: 30, title: "Make a little memory", description: "Personal stories, a toast, and a moment worth keeping." },
      { id: "farewell", time: "19:00", durationMinutes: 30, title: "Until next time", description: "Thoughtful goodbyes and a quick check of the venue." },
    ],
    checklist: [
      { id: "venue", title: "Confirm your venue and accessibility", daysBefore: 30 },
      { id: "menu", title: "Choose the menu and note dietary needs", daysBefore: 21 },
      { id: "invites", title: "Send invitations and collect RSVPs", daysBefore: 21 },
      { id: "vendors", title: "Request and compare vendor quotes", daysBefore: 14 },
      { id: "decor", title: "Finalize flowers, decor, and signage", daysBefore: 7 },
      { id: "check", title: "Confirm final numbers with your vendors", daysBefore: 2 },
    ],
    vendorChecklist: [
      { id: "venue", category: "Venue & furniture", description: "Find a comfortable space that fits your gathering.", questions: ["Is step-free access available?", "What furniture and setup time are included?"] },
      { id: "catering", category: "Food & catering", description: "A thoughtful menu with enough choice for everyone.", questions: ["Can you accommodate the dietary requirements?", "Does the quote include serving and cleanup?"] },
      { id: "flowers", category: "Florals & decor", description: "Seasonal details that bring the palette together.", questions: ["Can arrangements be reused or rented?", "Are delivery and removal included?"] },
      { id: "photo", category: "Photography", description: "Someone to capture the in-between moments.", questions: ["What are the delivery timeline and image rights?", "How many hours are included?"] },
    ],
    assumptions: ["Sample event with a provisional 4–7:30 pm schedule.", "All vendor categories are unconfirmed; no availability has been checked."],
    warnings: ["This is an illustrative sample plan, not an AI-generated response or a vendor quote."],
  };
}
const examples: EventBrief[] = [
  { title: "Aarav & Meera's wedding", eventType: "wedding", guestCount: 120, budgetMinor: 45000000, currency: "INR", eventDate: "2027-02-14", timeZone: "Asia/Kolkata", location: "Udaipur, Rajasthan", preferences: ["Garden ceremony", "Vegetarian menu", "Intimate and elegant"], exclusions: ["Single-use plastic"] },
  { title: "Thirty, flirty & thriving", eventType: "birthday", guestCount: 30, budgetMinor: 6000000, currency: "INR", eventDate: "2027-01-23", timeZone: "Asia/Kolkata", location: "Pune, Maharashtra", preferences: ["Rooftop dinner", "Golden hour", "Acoustic music"], exclusions: [] },
  { title: "The Sunday Social", eventType: "community", guestCount: 60, budgetMinor: 9000000, currency: "INR", eventDate: "2027-01-31", timeZone: "Asia/Kolkata", location: "Bengaluru, Karnataka", preferences: ["Outdoor gathering", "All ages", "Step-free access"], exclusions: ["Loud music"] },
];
export const sampleEvents: SavedEvent[] = examples.map((brief, index) => ({
  id: "sample-" + brief.eventType, brief, plan: samplePlan(brief), source: "sample", status: "planning",
  completedTasks: index === 0 ? ["venue", "invites"] : [], vendorStatus: {}, actualSpent: {},
  createdAt: "2026-10-22T00:00:00.000Z", updatedAt: "2026-10-22T00:00:00.000Z",
}));
