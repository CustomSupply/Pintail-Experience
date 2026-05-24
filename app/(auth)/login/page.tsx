import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "./login-form";
import { PintailLockup } from "@/components/pintail-logo";
import { VideoBackground } from "@/components/video-background";

export const metadata = { title: "Sign in · The Pintail Experience" };

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-12">
      <VideoBackground src="/video/hero-2.mp4" poster="/img/hero-2-poster.jpg" />
      <div className="pointer-events-none absolute inset-0 bg-background/80" />
      <div className="relative w-full max-w-sm">
        <Link href="/" className="flex justify-center">
          <PintailLockup height={44} />
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
