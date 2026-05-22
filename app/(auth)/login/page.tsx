import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "./login-form";
import { PintailLockup } from "@/components/pintail-logo";
import { stock } from "@/lib/stock";

export const metadata = { title: "Sign in · The Pintail Experience" };

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${stock("marshAutumn", 1600, 60)})` }}
      />
      <div className="pointer-events-none absolute inset-0 bg-background/85" />
      <div className="relative w-full max-w-sm">
        <Link href="/" className="flex justify-center">
          <PintailLockup wordmarkClassName="text-3xl" />
        </Link>
        <p className="mt-2 mb-8 text-center text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a sign-in link.
        </p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
