import "server-only";
import type { EventBrief } from "@/types/event";
import type { EventPlan } from "@/types/plan";
import { validatePlanOutput } from "@/lib/validation/plan-output";
import { AppError } from "@/lib/errors";
import { requestGemini } from "./gemini-client";
import { refinementPrompt } from "./prompts/refine-plan";
export async function refinePlan(event: EventBrief, plan: EventPlan, instruction: string) {
  const result = await requestGemini(refinementPrompt(event, plan, instruction));
  try { return validatePlanOutput(result, event); }
  catch { throw new AppError(502, "INVALID_AI_RESPONSE", "The revision didn't pass our budget and schedule checks. Your previous plan is unchanged."); }
}
