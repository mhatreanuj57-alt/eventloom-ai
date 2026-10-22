import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase/server";
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (code) {
    try {
      const db = await serverSupabase();
      const { error } = await db.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(new URL(url.searchParams.has("recovery") ? "/auth/sign-in?recovery=1" : "/dashboard", url.origin));
    } catch { /* The sign-in screen offers a new confirmation or recovery request. */ }
  }
  return NextResponse.redirect(new URL("/auth/sign-in?error=confirmation", url.origin));
}
