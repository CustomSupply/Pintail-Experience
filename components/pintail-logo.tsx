import { cn } from "@/lib/utils";

/** A pintail in flight — the brand mark. Uses currentColor so it inherits text color. */
export function PintailMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 32"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M2 22 C 14 8, 24 8, 32 20 C 40 8, 50 8, 62 22 C 50 14, 40 16, 32 26 C 24 16, 14 14, 2 22 Z" />
    </svg>
  );
}

/** Mark + Allura wordmark lockup, in champagne. */
export function PintailLockup({
  className,
  wordmarkClassName = "text-2xl",
}: {
  className?: string;
  wordmarkClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-pintail-champagne", className)}>
      <PintailMark className="h-4 w-auto" />
      <span className={cn("font-display leading-none", wordmarkClassName)}>
        The Pintail Experience
      </span>
    </span>
  );
}
