import Link from "next/link";
import { Asterisk } from "lucide-react";
export function Brand({ compact = false }: { compact?: boolean }) { return <Link href="/" className="brand" aria-label="EventLoom home"><span className="brand-mark"><Asterisk strokeWidth={1.6} size={27} /></span><span>eventloom<span className="brand-period">.</span>{!compact && <sup>AI</sup>}</span></Link>; }
