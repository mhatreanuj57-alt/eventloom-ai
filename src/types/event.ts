export type EventType = "wedding" | "birthday" | "community";
export type Currency = "INR" | "USD" | "EUR" | "GBP";
export interface EventBrief {
  title: string;
  eventType: EventType;
  guestCount: number;
  budgetMinor: number;
  currency: Currency;
  eventDate: string;
  timeZone: string;
  location: string;
  preferences: string[];
  exclusions: string[];
}
