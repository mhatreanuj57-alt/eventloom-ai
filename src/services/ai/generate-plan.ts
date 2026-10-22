import "server-only";
import type { EventBrief } from "@/types/event";
import { validatePlanOutput } from "@/lib/validation/plan-output";
import { AppError } from "@/lib/errors";
import { requestGemini } from "./gemini-client";
import { generationPrompt } from "./prompts/generate-plan";
export async function generatePlan(event: EventBrief) {
  const result = await requestGemini(generationPrompt(event));
  try { return validatePlanOutput(result, event); }
  catch { throw new AppError(502, "INVALID_AI_RESPONSE", "The generated plan didn't pass our budget and schedule checks. Please try again."); }
}
