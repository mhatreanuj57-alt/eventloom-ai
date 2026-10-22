import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { aiConfig } from "@/config/ai";
import { AppError } from "./errors";
let windowStart = Date.now();
let requestCount = 0;
export async function limitUsage(db?: SupabaseClient) {
  let count: number;
  if (db) {
    try {
      const { data, error } = await db.rpc("reserve_ai_request");
      if (error || !Number.isSafeInteger(data) || data === 0) throw new Error();
      count = data;
    } catch { throw new AppError(503, "LIMITER_UNAVAILABLE", "AI planning is temporarily unavailable. Your existing events are safe; please try again later."); }
  } else {
    if (process.env.NODE_ENV === "production") throw new AppError(503, "LIMITER_UNAVAILABLE", "Configure Supabase accounts and the shared AI quota before launching this studio.");
    // shortcut: process-local quota in development; production reserves usage atomically in PostgreSQL.
    if (Date.now() - windowStart >= 3_600_000) { windowStart = Date.now(); requestCount = 0; }
    count = ++requestCount;
  }
  if (count < 0 || count > aiConfig.hourlyRequests) throw new AppError(429, "RATE_LIMITED", "Your account or this studio has reached its hourly AI limit. Please try again next hour.");
}
