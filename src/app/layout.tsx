import type { Metadata } from "next";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import { Providers } from "@/components/layout/providers";
import { site } from "@/config/site";
export const metadata: Metadata = { title: { default: "EventLoom AI — Make room for the celebration", template: "%s | EventLoom AI" }, description: site.description, applicationName: "EventLoom AI", icons: { icon: "/icon.svg" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning><body><a className="skip-link" href="#main-content">Skip to content</a><Providers>{children}</Providers></body></html>; }
