"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <main id="main-content" className="page-loading"><span className="eyebrow">A SMALL DETOUR</span><h1>Let’s try that again.</h1><p>Your saved events are still on this device.</p><Button onClick={reset}>Try again</Button></main>; }
