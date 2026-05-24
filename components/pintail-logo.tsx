import { cn } from "@/lib/utils";

/** A pintail in flight — small inline mark (used where the wordmark is too wide). */
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

/** The real Pintail wordmark (champagne script) with an "Experience" caption. */
export function PintailLockup({
  className,
  height = 30,
  caption = true,
}: {
  className?: string;
  height?: number;
  caption?: boolean;
}) {
  return (
    <span className={cn("inline-flex flex-col items-center", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/wordmark.png"
        alt="The Pintail Experience"
        style={{ height }}
        className="w-auto"
      />
      {caption && (
        <span className="mt-1 text-[0.6rem] uppercase tracking-[0.4em] text-pintail-champagne/80">
          The Experience
        </span>
      )}
    </span>
  );
}
