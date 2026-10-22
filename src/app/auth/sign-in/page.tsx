import { AuthForm } from "@/components/auth/auth-form";
export const metadata = { title: "Sign in" };
export default async function SignInPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  return <AuthForm recovery={params.recovery === "1"} confirmationFailed={params.error === "confirmation"} />;
}
