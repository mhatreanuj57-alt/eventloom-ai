import "server-only";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { getAiEnvironment } from "@/lib/env";
import { AppError } from "@/lib/errors";
import { aiConfig } from "@/config/ai";
import { planSchema } from "@/lib/validation/plan-output";
import { systemPrompt } from "./prompts/system";
export async function requestGemini(prompt: string): Promise<unknown> {
  const { apiKey, model } = getAiEnvironment();
  try {
    const ai = new GoogleGenAI({ apiKey, httpOptions: { timeout: aiConfig.timeoutMs, retryOptions: { attempts: 1 } } });
    // Gemini rejects these validation keywords; the complete Zod schema still validates every response.
    const unsupported = ["$schema", "additionalProperties", "minLength", "maxLength", "minItems", "maxItems", "minimum", "maximum", "pattern"];
    const responseJsonSchema = JSON.parse(JSON.stringify(z.toJSONSchema(planSchema), (key, value) => unsupported.includes(key) ? undefined : value));
    const response = await ai.models.generateContent({
      model, contents: prompt,
      config: { systemInstruction: systemPrompt, responseMimeType: "application/json", responseJsonSchema, temperature: 0.4, maxOutputTokens: aiConfig.maxOutputTokens },
    });
    const text = response.text;
    if (!text || text.length > 60_000) throw new AppError(502, "INVALID_AI_RESPONSE", "Gemini couldn't produce a complete plan. Your details are saved; please try again.");
    try { return JSON.parse(text); }
    catch { throw new AppError(502, "INVALID_AI_RESPONSE", "Gemini returned an incomplete plan. Please try again."); }
  } catch (error) {
    if (error instanceof AppError) throw error;
    const status = typeof error === "object" && error !== null && "status" in error ? Number(error.status) : 0;
    if (status === 429) throw new AppError(429, "RATE_LIMITED", "Gemini's quota is busy. Please wait before trying again.");
    if (error instanceof Error && /timeout|timed out|abort/i.test(error.name + error.message)) throw new AppError(504, "AI_TIMEOUT", "Planning took longer than expected. Please try again.");
    throw new AppError(503, "AI_UNAVAILABLE", "The AI planner is temporarily unavailable. Your details are safe; please try again later.");
  }
}
