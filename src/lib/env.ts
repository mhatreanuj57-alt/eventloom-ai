import "server-only";
import { AppError } from "./errors";
export function getAiEnvironment() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new AppError(503, "AI_NOT_CONFIGURED", "Gemini is not configured yet. Save your event as a draft and try again after the server key is added.");
  return { apiKey, model: process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash-lite" };
}
