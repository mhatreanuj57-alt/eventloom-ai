import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { aiConfig } from "@/config/ai";
import { limitUsage } from "./rate-limit";
import { supabaseConfigured } from "./supabase/client";
import { requireAccount } from "./supabase/server";
import { checkRequestOrigin } from "./request-origin";
import { AppError, apiError } from "./errors";
import { futureEventSchema } from "./validation/event-input";
import { planSchema, validatePlanOutput } from "./validation/plan-output";
import { generatePlan } from "@/services/ai/generate-plan";
import { refinePlan } from "@/services/ai/refine-plan";

export async function readJson(request: Request, maxBytes: number = aiConfig.maxRequestBytes): Promise<unknown> {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") throw new AppError(415, "UNSUPPORTED_MEDIA_TYPE", "Send the event as JSON.");
  if (Number(request.headers.get("content-length")) > maxBytes) throw new AppError(413, "PAYLOAD_TOO_LARGE", "This request is too large. Shorten your details and try again.");
  if (!request.body) throw new AppError(400, "INVALID_INPUT", "Enter your event details.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) { await reader.cancel(); throw new AppError(413, "PAYLOAD_TOO_LARGE", "This request is too large. Shorten your details and try again."); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const body = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  try { return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body)); }
  catch { throw new AppError(400, "INVALID_INPUT", "The event details could not be read. Please try again."); }
}
async function authorize(request: Request) {
  checkRequestOrigin(request);
  if (supabaseConfigured()) return requireAccount();
  const token = process.env.EVENTLOOM_ACCESS_TOKEN?.trim();
  if (!token && process.env.NODE_ENV === "production") throw new AppError(503, "ACCESS_NOT_CONFIGURED", "AI generation needs a server access token before this studio can accept public requests.");
  if (token) {
    const received = request.headers.get("authorization")?.replace(/^Bearer /i, "") ?? "";
    const digest = (value: string) => createHash("sha256").update(value).digest();
    if (!timingSafeEqual(digest(token), digest(received))) throw new AppError(401, "ACCESS_REQUIRED", "Enter the studio access token in Settings to use AI planning.");
  }
}
export async function handlePlanRequest(request: Request, mode: "generate" | "refine") {
  const requestId = crypto.randomUUID();
  const headers = { "Cache-Control": "no-store", "X-Request-Id": requestId };
  try {
    const account = await authorize(request);
    const body = await readJson(request);
    let event;
    let data;
    if (mode === "generate") {
      event = futureEventSchema.parse(body);
      await limitUsage(account?.db);
      data = await generatePlan(event);
    } else {
      const input = z.object({ event: futureEventSchema, currentPlan: planSchema, instruction: z.string().trim().min(1).max(1000) }).strict().parse(body);
      event = input.event;
      try { validatePlanOutput(input.currentPlan, event); }
      catch { throw new AppError(400, "INVALID_INPUT", "The current plan doesn't match this event. Edit the event and regenerate its plan."); }
      await limitUsage(account?.db);
      data = await refinePlan(event, input.currentPlan, input.instruction);
    }
    return Response.json({ data, effectiveEvent: event, requestId }, { headers });
  } catch (error) {
    const failure = error instanceof z.ZodError
      ? new AppError(400, "INVALID_INPUT", "Please check the highlighted event details.", z.flattenError(error).fieldErrors as Record<string, string[]>)
      : apiError(error);
    return Response.json({ error: { code: failure.code, message: failure.message, ...(failure.fields ? { fields: failure.fields } : {}) }, requestId }, { status: failure.status, headers });
  }
}
