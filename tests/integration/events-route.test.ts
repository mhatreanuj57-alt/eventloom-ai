import { beforeEach, expect, it, vi } from "vitest";
const { requireAccount, query, db } = vi.hoisted(() => {
  const query = { select: vi.fn(), eq: vi.fn(), order: vi.fn(), limit: vi.fn(), insert: vi.fn(), update: vi.fn(), delete: vi.fn(), single: vi.fn(), maybeSingle: vi.fn() };
  return { requireAccount: vi.fn(), query, db: { from: vi.fn(), rpc: vi.fn() } };
});
vi.mock("@/lib/supabase/server", () => ({ requireAccount }));
import { GET, POST, PUT } from "@/app/api/events/route";
import { AppError } from "@/lib/errors";
import { sampleEvents } from "@/lib/sample-events";
const request = (body: unknown, origin = "https://studio.example") => new Request("https://studio.example/api/events", { method: "POST", headers: { "Content-Type": "application/json", Origin: origin }, body: JSON.stringify(body) });
beforeEach(() => {
  for (const fn of Object.values(query)) fn.mockReturnValue(query);
  db.from.mockReturnValue(query);
  requireAccount.mockResolvedValue({ db, user: { id: "synthetic-owner" } });
});
it("requires verified account access", async () => {
  requireAccount.mockRejectedValue(new AppError(401, "SIGN_IN_REQUIRED", "Sign in first."));
  expect((await GET()).status).toBe(401);
  expect(db.from).not.toHaveBeenCalled();
});
it("checks origin before using account data", async () => {
  expect((await POST(request({}, "https://evil.example"))).status).toBe(403);
  expect(requireAccount).not.toHaveBeenCalled();
});
it("rejects invalid plans and backups without writing", async () => {
  expect((await POST(request({ event: { ...sampleEvents[0], completedTasks: ["foreign"] } }))).status).toBe(400);
  expect((await PUT(request([{ broken: true }]))).status).toBe(400);
  expect(db.from).not.toHaveBeenCalled(); expect(db.rpc).not.toHaveBeenCalled();
});
it("binds updates to the verified owner and expected database version", async () => {
  query.maybeSingle.mockResolvedValue({ data: { updated_at: "new-version" }, error: null });
  const response = await POST(request({ event: sampleEvents[0], version: "old-version" }));
  expect(response.status).toBe(200);
  expect(query.eq).toHaveBeenCalledWith("user_id", "synthetic-owner");
  expect(query.eq).toHaveBeenCalledWith("updated_at", "old-version");
});
it("returns a conflict instead of overwriting a concurrent edit", async () => {
  query.maybeSingle.mockResolvedValue({ data: null, error: null });
  expect((await POST(request({ event: sampleEvents[0], version: "stale" }))).status).toBe(409);
});
it("restores a validated workspace atomically", async () => {
  db.rpc.mockResolvedValue({ error: null });
  expect((await PUT(request(sampleEvents))).status).toBe(200);
  expect(db.rpc).toHaveBeenCalledWith("replace_event_workspace", { items: sampleEvents });
});
