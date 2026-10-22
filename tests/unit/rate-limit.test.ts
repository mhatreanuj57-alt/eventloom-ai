import { afterEach, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { limitUsage } from "@/lib/rate-limit";
afterEach(() => vi.unstubAllEnvs());
it("reserves an atomic quota without sending event details", async () => {
  const rpc = vi.fn().mockResolvedValue({ data: 20, error: null });
  await expect(limitUsage({ rpc } as unknown as SupabaseClient)).resolves.toBeUndefined();
  expect(rpc).toHaveBeenCalledWith("reserve_ai_request");
});
it.each([-1, 21])("rejects account or studio exhaustion (%s)", async data => {
  await expect(limitUsage({ rpc: vi.fn().mockResolvedValue({ data, error: null }) } as unknown as SupabaseClient)).rejects.toMatchObject({ status: 429 });
});
it.each([{ data: null, error: { message: "private internals" } }, { data: "1", error: null }, { data: 0, error: null }])("fails closed on invalid quota results", async result => {
  await expect(limitUsage({ rpc: vi.fn().mockResolvedValue(result) } as unknown as SupabaseClient)).rejects.toMatchObject({ status: 503 });
});
it("requires shared storage in production", async () => {
  vi.stubEnv("NODE_ENV", "production");
  await expect(limitUsage()).rejects.toMatchObject({ status: 503 });
});
