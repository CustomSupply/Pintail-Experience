import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "./login-form";
import { PintailLockup } from "@/components/pintail-logo";

export const metadata = { title: "Sign in · The Pintail Experience" };

export default function LoginPage() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
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
