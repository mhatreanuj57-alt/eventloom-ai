"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { browserSupabase } from "@/lib/supabase/client";
import { useAccount } from "./account-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusMessage } from "@/components/ui/status-message";
import { Brand } from "@/components/layout/brand";

export function AuthForm({ recovery = false, confirmationFailed = false }: { recovery?: boolean; confirmationFailed?: boolean }) {
  const account = useAccount();
  const router = useRouter();
  const [mode, setMode] = useState<"sign-in" | "sign-up" | "reset" | "password">(recovery ? "password" : "sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(confirmationFailed ? "This confirmation link couldn't be verified. Try signing in, or request a fresh recovery link." : "");
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setPending(true); setError(""); setMessage("");
    try {
      const db = browserSupabase();
      const redirectTo = `${window.location.origin}/auth/callback`;
      if (mode === "reset") {
        const { error } = await db.auth.resetPasswordForEmail(email.trim(), { redirectTo: redirectTo + "?recovery=1" });
        if (error) throw new Error("A recovery email couldn't be sent. Please wait and try again.");
        setMessage("If this address has an account, a recovery link will arrive. Open it in this browser.");
      } else if (mode === "password") {
        const { error } = await db.auth.updateUser({ password });
        if (error) throw new Error("The password couldn't be updated. Open a fresh recovery link and try again.");
        setPassword(""); setMessage("Your password has been updated."); setMode("sign-in");
      } else if (mode === "sign-up") {
        const { data, error } = await db.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: redirectTo } });
        if (error) throw new Error("The account couldn't be created. Check the address and password, or try signing in.");
        setPassword("");
        if (data.session) router.replace("/dashboard");
        else setMessage("Check your inbox to confirm your email, then sign in. Open the confirmation link in this browser.");
      } else {
        const { error } = await db.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw new Error("Sign in failed. Check your email and password, and confirm your email first.");
        setPassword(""); router.replace("/dashboard");
      }
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Account access is temporarily unavailable."); }
    finally { setPending(false); }
  }
  return <main id="main-content" className="auth-page"><Brand /><section className="auth-panel"><span className="eyebrow">A PLACE FOR YOUR CELEBRATIONS</span><h1>{mode === "sign-up" ? "Your next chapter starts here." : mode === "reset" ? "Find your way back." : mode === "password" ? "A fresh password." : "Welcome to your studio."}</h1><p>Sign in to keep your events private and available across devices. Guest plans stay in this browser until you explicitly import a backup.</p>{!account.configured ? <StatusMessage>Account access is not configured yet. Add the Supabase connection settings to enable sign-in.</StatusMessage> : <><form onSubmit={event => void submit(event)}><fieldset disabled={pending} className="auth-fields"><legend className="sr-only">Account credentials</legend>{mode !== "password" && <div className="form-field"><label htmlFor="email">Email address</label><Input id="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} /></div>}{mode !== "reset" && <div className="form-field"><label htmlFor="password">{mode === "password" ? "New password" : "Password"}</label><Input id="password" type="password" autoComplete={mode === "sign-in" ? "current-password" : "new-password"} minLength={mode === "sign-in" ? 1 : 12} maxLength={128} required value={password} onChange={e => setPassword(e.target.value)} />{mode !== "sign-in" && <small>Use at least 12 characters.</small>}</div>}<Button type="submit">{pending ? "One moment…" : mode === "sign-up" ? "Create account" : mode === "reset" ? "Send recovery link" : mode === "password" ? "Update password" : "Sign in"}</Button></fieldset></form>{pending && <StatusMessage kind="loading">Connecting securely to your account…</StatusMessage>}{error && <StatusMessage>{error}</StatusMessage>}{message && <StatusMessage kind="success">{message}</StatusMessage>}<div className="auth-links"><Button variant="link" disabled={pending} onClick={() => { setMode(mode === "sign-up" ? "sign-in" : "sign-up"); setError(""); setMessage(""); }}>{mode === "sign-up" ? "Already have an account? Sign in" : "New here? Create an account"}</Button><Button variant="link" disabled={pending} onClick={() => { setMode("reset"); setError(""); setMessage(""); }}>Forgot password?</Button>{account.user && <Button variant="link" onClick={() => setMode("password")}>Set a new password</Button>}</div></>}<Link className="back-link" href="/dashboard">Explore the studio</Link></section></main>;
}
