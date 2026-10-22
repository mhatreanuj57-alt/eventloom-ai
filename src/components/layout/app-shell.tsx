"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarDays, Wallet, ListChecks, Settings, ArrowUpRight, Plus, Menu } from "lucide-react";
import { useState } from "react";
import { Brand } from "./brand";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useEvents } from "@/hooks/use-events";
import { useAccount } from "@/components/auth/account-provider";
import { StatusMessage } from "@/components/ui/status-message";
const navigation = [
  { href: "/dashboard", title: "Overview", icon: LayoutDashboard },
  { href: "/events", title: "My events", icon: CalendarDays },
  { href: "/budget", title: "Budget studio", icon: Wallet },
  { href: "/checklist", title: "Checklists", icon: ListChecks },
];
export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { events, warning, isExample, loading, saving, refresh } = useEvents();
  const account = useAccount();
  const title = [...navigation, { href: "/settings", title: "Settings" }].find(item => path.startsWith(item.href))?.title ?? "Create an event";
  return <Dialog open={open} onOpenChange={setOpen}><div className="studio">

    <aside className="sidebar" aria-label="Studio sidebar">
      <div className="sidebar-brand"><Brand /></div>
      <div className="workspace-label"><span className="workspace-avatar">E</span><div>Your celebration studio<small>Personal workspace</small></div></div>
      <div className="nav-caption">WORKSPACE</div>
      <nav aria-label="Studio navigation">{navigation.map(item => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} aria-current={path.startsWith(item.href) ? "page" : undefined} className={`sidebar-link ${path.startsWith(item.href) ? "active" : ""}`}><item.icon size={18} strokeWidth={1.7} />{item.title}{item.href === "/events" && <span className="nav-count">{events.length}</span>}</Link>)}</nav>
      <div className="sidebar-notebook"><span className="small-star">✳</span><h3>Make room for<br />the good moments.</h3><p>You bring the occasion.<br />We’ll help with the details.</p><Button asChild variant="outline" size="sm"><Link href="/planner">Plan something lovely <ArrowUpRight size={14} /></Link></Button></div>
      <div className="sidebar-bottom"><Link href="/settings" className={`sidebar-link ${path === "/settings" ? "active" : ""}`} onClick={() => setOpen(false)}><Settings size={18} />Settings</Link><div className="local-profile"><span className="profile-avatar">Y</span><div>Your workspace<small>{account.user ? "Saved to your account" : "Saved on this device"}</small></div><span className="local-indicator" title="Local browser storage" /></div></div>
    </aside>
    <div className="studio-main">
      <header className="studio-topbar"><div className="breadcrumbs"><DialogTrigger asChild><button className="mobile-menu" aria-label="Open navigation"><Menu size={21} /></button></DialogTrigger><span>Workspace</span><span className="breadcrumb-slash">/</span><strong>{title}</strong></div><div className="topbar-actions"><span className="studio-tag"><span /> Personal studio</span><ThemeToggle /><Button asChild size="sm"><Link href="/planner"><Plus size={15} /> New event</Link></Button></div></header>
      <main id="main-content" className="studio-content">
        {warning && <div className="workspace-warning" role="alert">{warning} <Link href="/settings">Open Settings</Link></div>}
        {isExample && <div className="example-banner"><span><span className="example-dot" /> You’re exploring a sample workspace. All events and numbers below are illustrative.</span><Link href="/planner">Create your first event <ArrowUpRight size={13} /></Link></div>}
        {account.loading || loading ? <StatusMessage kind="loading">Opening your workspace…</StatusMessage> : <><div className="account-banner">{account.user ? <><span>Your private account workspace</span><Link href="/settings">Account settings</Link></> : <><span>Guest workspace · Saved only in this browser</span><Link href="/auth/sign-in">Sign in to sync your events</Link></>}</div>{saving && <StatusMessage kind="loading">Saving your account changes…</StatusMessage>}{account.user && warning && <Button variant="outline" size="sm" onClick={() => void refresh()}>Reload workspace</Button>}<fieldset className="workspace-fields" disabled={saving}><legend className="sr-only">Your event workspace</legend>{children}</fieldset></>}
      </main>
      <footer className="studio-footer"><span>A little less planning. A lot more celebrating.</span><span>EventLoom AI · Open source</span></footer>
    </div>
    <DialogContent className="mobile-navigation"><DialogTitle className="sr-only">Your celebration studio</DialogTitle><DialogDescription className="sr-only">Choose a workspace section.</DialogDescription><Brand /><nav aria-label="Mobile studio navigation">{navigation.map(item => <Link className={`sidebar-link ${path.startsWith(item.href) ? "active" : ""}`} href={item.href} key={item.href} onClick={() => setOpen(false)}><item.icon size={19} />{item.title}</Link>)}<Link href="/settings" className="sidebar-link" onClick={() => setOpen(false)}><Settings size={19} />Settings</Link></nav><Button asChild><Link href="/planner" onClick={() => setOpen(false)}><Plus size={16} />Create an event</Link></Button></DialogContent>
  </div></Dialog>;
}
