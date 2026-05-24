import Link from "next/link";
import { PintailLockup } from "@/components/pintail-logo";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <PintailLockup height={42} />
      <div>
        <h1 className="font-serif text-2xl">Off the trail</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn&apos;t find that page.
        </p>
      </div>
      <Link href="/" className={buttonVariants({})}>
        Back to the start
      </Link>
    </main>
  );
}
