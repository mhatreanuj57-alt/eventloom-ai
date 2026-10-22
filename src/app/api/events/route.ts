import { z } from "zod";
import { requireAccount } from "@/lib/supabase/server";
import { AppError, apiError } from "@/lib/errors";
import { readJson } from "@/lib/plan-route";
import { savedEventSchema, savedEventsSchema } from "@/lib/validation/plan-output";
import { checkRequestOrigin } from "@/lib/request-origin";

export const runtime = "nodejs";
export const maxDuration = 30;
const headers = { "Cache-Control": "private, no-store" };
function fail(error: unknown) {
  const failure = error instanceof z.ZodError ? new AppError(400, "INVALID_INPUT", "The event data is invalid. Your saved events are unchanged.") : apiError(error);
  return Response.json({ error: { code: failure.code, message: failure.message } }, { status: failure.status, headers });
}
export async function GET() {
  try {
    const { db, user } = await requireAccount();
    const { data, error } = await db.from("events").select("payload,updated_at").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(51);
    if (error) throw new AppError(503, "STORAGE_UNAVAILABLE", "Your account events couldn't be loaded. Please try again.");
    const events = savedEventsSchema.parse(data.map(row => row.payload));
    return Response.json({ events, versions: Object.fromEntries(data.map(row => [row.payload.id, row.updated_at])) }, { headers });
  } catch (error) { return fail(error); }
}
export async function POST(request: Request) {
  try {
    checkRequestOrigin(request, true);
    const { db, user } = await requireAccount();
    const input = z.object({ event: savedEventSchema, version: z.string().max(80).optional() }).strict().parse(await readJson(request, 100_000));
    const result = input.version
      ? await db.from("events").update({ payload: input.event }).eq("user_id", user.id).eq("id", input.event.id).eq("updated_at", input.version).select("updated_at").maybeSingle()
      : await db.from("events").insert({ id: input.event.id, user_id: user.id, payload: input.event }).select("updated_at").single();
    if (result.error?.code === "23505" || (!result.error && !result.data)) throw new AppError(409, "EVENT_CONFLICT", "This event changed in another session. Reload your workspace before saving again.");
    if (result.error) throw new AppError(503, "SAVE_FAILED", "The event couldn't be saved. Check the 50-event account limit and try again.");
    return Response.json({ version: result.data!.updated_at }, { headers });
  } catch (error) { return fail(error); }
}
export async function DELETE(request: Request) {
  try {
    checkRequestOrigin(request, true);
    const { db, user } = await requireAccount();
    const input = z.object({ id: z.string().regex(/^[a-zA-Z0-9_-]{1,100}$/), version: z.string().max(80) }).strict().parse(await readJson(request));
    const { data, error } = await db.from("events").delete().eq("user_id", user.id).eq("id", input.id).eq("updated_at", input.version).select("id");
    if (error) throw new AppError(503, "DELETE_FAILED", "The event couldn't be deleted. Please try again.");
    if (!data.length) throw new AppError(409, "EVENT_CONFLICT", "This event changed in another session. Reload your workspace before deleting it.");
    return Response.json({ deleted: true }, { headers });
  } catch (error) { return fail(error); }
}
export async function PUT(request: Request) {
  try {
    checkRequestOrigin(request, true);
    const { db } = await requireAccount();
    const events = savedEventsSchema.parse(await readJson(request, 4_000_000));
    const { error } = await db.rpc("replace_event_workspace", { items: events });
    if (error) throw new AppError(503, "RESTORE_FAILED", "Your workspace couldn't be replaced. Existing events have been preserved.");
    return Response.json({ restored: true }, { headers });
  } catch (error) { return fail(error); }
}
