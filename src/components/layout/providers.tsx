"use client";
import { ThemeProvider } from "next-themes";
import { AccountProvider } from "@/components/auth/account-provider";
export function Providers({ children }: { children: React.ReactNode }) { return <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange><AccountProvider>{children}</AccountProvider></ThemeProvider>; }
