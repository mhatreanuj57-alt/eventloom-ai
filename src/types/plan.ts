import type { Currency, EventBrief } from "./event";
export interface EventPlan {
  title: string;
  summary: string;
  currency: Currency;
  budgetMinor: number;
  estimatedTotalMinor: number;
  theme: { name: string; description: string; palette: string[]; ideas: string[] };
  budgetItems: { id: string; label: string; amountMinor: number; note: string }[];
  itinerary: { id: string; time: string; durationMinutes: number; title: string; description: string }[];
  checklist: { id: string; title: string; daysBefore: number }[];
  vendorChecklist: { id: string; category: string; description: string; questions: string[] }[];
  assumptions: string[];
  warnings: string[];
}
export interface SavedEvent {
  id: string;
  brief: EventBrief;
  plan: EventPlan | null;
  source: "sample" | "gemini" | "draft";
  status: "planning" | "confirmed" | "completed";
  completedTasks: string[];
  vendorStatus: Record<string, "todo" | "contacted" | "booked">;
  actualSpent: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}
