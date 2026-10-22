import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() { return <main id="main-content" className="page-loading"><span className="eyebrow">404 · OFF THE GUEST LIST</span><h1>This page wandered off.</h1><p>Let’s get you back to the celebration.</p><Button asChild><Link href="/dashboard">Back to your studio</Link></Button></main>; }
