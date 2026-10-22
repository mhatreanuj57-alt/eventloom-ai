"use client";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Download, Upload, Monitor, Sun, Moon, KeyRound, Database, ExternalLink } from "lucide-react";
import { useEvents, setAccessToken, getAccessToken } from "@/hooks/use-events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusMessage } from "@/components/ui/status-message";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { site } from "@/config/site";
import { parseBackup } from "@/lib/event-storage";
import type { SavedEvent } from "@/types/plan";
import { useAccount } from "@/components/auth/account-provider";
export function Settings() {
  const { theme, setTheme } = useTheme();
  const { user, configured, signOut } = useAccount();
  const { events, clear, loadExamples, restore } = useEvents();
  const [token, setToken] = useState(getAccessToken);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [action, setAction] = useState<"clear" | "samples" | "restore" | null>(null);
  const [backup, setBackup] = useState<SavedEvent[]>([]);
  async function importBackup(file?: File) {
    if (!file) return;
    setError(""); setMessage("");
    try {
      if (file.size > 4_000_000) throw new Error("Choose an EventLoom backup smaller than 4 MB.");
      setBackup(parseBackup(await file.text())); setAction("restore");
    } catch (failure) { setError(failure instanceof Error ? failure.message : "The backup couldn't be read."); }
  }
  function exportBackup() {
    try {
      const raw = user ? null : localStorage.getItem("eventloom.events.v1");
      const blob = new Blob([raw ?? JSON.stringify(events)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url; anchor.download = "eventloom-backup.json"; anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000); setMessage("Your backup has been downloaded."); setError("");
    } catch { setError("The backup couldn't be downloaded in this browser."); }
  }
  async function confirm() {
    try { if (action === "clear") await clear(); else if (action === "restore") await restore(backup); else await loadExamples(); setMessage(action === "clear" ? "Your workspace has been cleared." : action === "restore" ? "Your backup has been restored on this device." : "The sample workspace is ready to explore."); setError(""); setAction(null); setBackup([]); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "The change couldn't be saved."); setAction(null); }
  }
  return <div className="settings-page"><div className="page-heading"><div><span className="eyebrow">MAKE YOURSELF AT HOME</span><h1>Your studio. <em>Your way.</em></h1><p>A few considered settings for a space that feels like yours.</p></div></div>{message && <StatusMessage kind="success">{message}</StatusMessage>}{error && <StatusMessage>{error}</StatusMessage>}
  <section className="settings-section"><div><h2>{user ? "Your account" : "Keep your celebrations together"}</h2><p>{user ? user.email : "Sign in to save private events across devices. Guest events are never uploaded automatically."}</p></div>{user ? <Button variant="outline" onClick={() => { void signOut().then(() => setMessage("You have signed out. Your account events remain private.")).catch(failure => setError(failure.message)); }}>Sign out</Button> : <a className="text-link" href="/auth/sign-in">Sign in or create an account</a>}</section>
  <section className="settings-section"><div><Sun size={21} /><h2>Set the mood</h2><p>A little lighter, a little darker, or in tune with your device.</p></div><div className="theme-choices">{[["light", "Daylight", Sun], ["dark", "After hours", Moon], ["system", "Your device", Monitor]].map(([value, label, Icon]) => { const ThemeIcon = Icon as typeof Sun; return <button key={String(value)} className={theme === value ? "selected" : ""} aria-pressed={theme === value} onClick={() => setTheme(String(value))}><ThemeIcon size={23} /><span>{String(label)}</span></button>; })}</div></section>
  {!configured && <section className="settings-section"><div><KeyRound size={21} /><h2>A key to the studio</h2><p>If this studio requires an access token, enter the one supplied by its owner. This is not your Gemini API key.</p></div><form className="access-form" onSubmit={e => { e.preventDefault(); setAccessToken(token.trim()); setMessage("Access token saved for this page session only."); }}><label htmlFor="access-token">Studio access token</label><div><Input id="access-token" type="password" autoComplete="off" value={token} maxLength={256} onChange={e => setToken(e.target.value)} /><Button type="submit" variant="outline">Save token</Button></div><small>The token is kept in memory and clears when you refresh. Gemini credentials belong only in the server environment.</small></form></section>}
  <section className="settings-section"><div><Database size={21} /><h2>{user ? "Your private account workspace" : "A little space, on this device"}</h2><p>{user ? "Events and progress are saved to your Supabase account. Keep a backup before replacing or clearing your workspace." : "Guest events stay in this browser. Sign in, then restore an exported backup to move them into your private account."}</p></div><div className="data-actions"><Button variant="outline" onClick={exportBackup}><Download size={16} />Export a backup</Button><Button variant="outline" onClick={() => setAction("samples")}>Load sample events</Button><Button variant="ghost" className="danger-text" onClick={() => setAction("clear")}>Clear this workspace</Button></div></section>
  <section className="settings-section"><div><Upload size={21} /><h2>Bring your plans back</h2><p>Restore an EventLoom JSON backup, up to 4 MB and 50 events. Review the confirmation before replacing your current workspace.</p></div><div className="form-field"><label htmlFor="restore-backup">Restore a backup</label><Input id="restore-backup" type="file" accept="application/json,.json" onChange={e => { void importBackup(e.target.files?.[0]); e.target.value = ""; }} /></div></section>
  <section className="settings-section open-source-section"><div><h2>Made open, made with care.</h2><p>EventLoom AI is an MIT-licensed project for PromptWars Virtual 2026. Suggestions and estimated costs need your review.</p></div><a className="text-link" href={site.repository} target="_blank" rel="noreferrer">Explore the source <ExternalLink size={15} /></a></section>
  <Dialog open={action !== null} onOpenChange={open => { if (!open) setAction(null); }}><DialogContent><span className="eyebrow">BEFORE WE MAKE A CHANGE</span><DialogTitle className="dialog-title">{action === "clear" ? "Start with a clean page?" : action === "restore" ? `Restore ${backup.length} events?` : "Explore the sample workspace?"}</DialogTitle><DialogDescription className="dialog-description">This replaces all events, plans, and spending records in your current workspace. Export a backup first. This action can’t be undone inside the app.</DialogDescription><div className="dialog-actions"><Button variant="outline" onClick={() => setAction(null)}>Keep my workspace</Button><Button variant="destructive" onClick={confirm}>{action === "clear" ? "Clear workspace" : action === "restore" ? "Restore backup" : "Replace with samples"}</Button></div></DialogContent></Dialog>
  </div>;
}
