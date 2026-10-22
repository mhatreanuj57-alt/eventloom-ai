import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Currency } from "@/types/event";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function money(amountMinor: number, currency: Currency = "INR") {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 2 }).format(amountMinor / 100);
}
export function dateLabel(value: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-GB", options ?? { day: "numeric", month: "short", year: "numeric" }).format(new Date(value + "T12:00:00"));
}
export function dateInZone(timeZone: string, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const part = (type: string) => parts.find(p => p.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}
export function taskDueDate(eventDate: string, daysBefore: number) {
  const date = new Date(eventDate + "T12:00:00");
  date.setDate(date.getDate() - daysBefore);
  return dateLabel(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`, { day: "numeric", month: "short" });
}
