"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PintailLockup } from "@/components/pintail-logo";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <PintailLockup wordmarkClassName="text-3xl" />
      <div>
        <h1 className="font-serif text-2xl">Something went sideways</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We hit an unexpected error. Try again.
        </p>
      </div>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
