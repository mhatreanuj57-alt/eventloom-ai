import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { AppError } from "@/lib/errors";
import { supabaseConfigured, supabaseFetch } from "./client";
export async function serverSupabase() {
  if (!supabaseConfigured()) throw new AppError(503, "ACCOUNT_NOT_CONFIGURED", "Account storage is not configured yet.");
  const jar = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    global: { fetch: supabaseFetch },
    cookies: { getAll: () => jar.getAll(), setAll: values => { values.forEach(({ name, value, options }) => jar.set(name, value, options)); } },
  });
}
export async function requireAccount() {
  const db = await serverSupabase();
  const { data, error } = await db.auth.getUser();
  if (error || !data.user) throw new AppError(401, "SIGN_IN_REQUIRED", "Sign in to save events and generate plans for your account.");
  return { db, user: data.user };
}
