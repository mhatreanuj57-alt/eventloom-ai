import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "./brand";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
export function SiteHeader() {
  return <header className="site-header"><div className="site-container header-inner"><Brand /><nav aria-label="Main navigation" className="marketing-nav"><Link href="/#how-it-works">How it works</Link><Link href="/#occasions">The occasions</Link><a href="https://github.com/mhatreanuj57-alt/eventloom-ai" target="_blank" rel="noreferrer">Open source <ArrowUpRight size={13} /></a></nav><div className="header-actions"><Link className="header-signin" href="/auth/sign-in">Sign in</Link><ThemeToggle /><Button asChild variant="outline" className="header-studio"><Link href="/dashboard">Open the studio <ArrowUpRight size={15} /></Link></Button></div></div></header>;
}
