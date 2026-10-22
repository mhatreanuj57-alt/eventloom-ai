"use client";
import { useCallback, useRef, useState, useEffect } from "react";
import type { EventBrief } from "@/types/event";
import type { EventPlan } from "@/types/plan";
import { validatePlanOutput } from "@/lib/validation/plan-output";
import { eventInputSchema } from "@/lib/validation/event-input";
import { getAccessToken } from "./use-events";
export function useEventPlanner() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  const run = useCallback(async (event: EventBrief, currentPlan?: EventPlan, instruction?: string) => {
    if (controller.current) return null;
    const active = new AbortController();
    controller.current = active;
    setPending(true); setError("");
    const deadline = setTimeout(() => active.abort(), 75_000);
    try {
      const token = getAccessToken();
      const response = await fetch(currentPlan ? "/api/plans/refine" : "/api/plans", {
        method: "POST", headers: { "Content-Type": "application/json", ...(token ? { Authorization: "Bearer " + token } : {}) },
        body: JSON.stringify(currentPlan ? { event, currentPlan, instruction } : event), signal: active.signal,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || "Planning is unavailable right now. Please try again.");
      const effectiveEvent = eventInputSchema.parse(result.effectiveEvent);
      return { plan: validatePlanOutput(result.data, effectiveEvent), event: effectiveEvent };
    } catch (failure) {
      if (failure instanceof Error && failure.name === "AbortError") setError("Planning timed out. Your event details are unchanged; please try again.");
      else setError(failure instanceof Error ? failure.message : "We couldn't generate a plan. Please try again.");
      return null;
    } finally { clearTimeout(deadline); controller.current = null; setPending(false); }
  }, []);
  return { run, pending, error, clearError: () => setError("") };
}
