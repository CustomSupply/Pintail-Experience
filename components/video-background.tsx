"use client";

import { cn } from "@/lib/utils";

// Muted, looping, autoplaying video for cinematic backgrounds. `playsInline`
// + `muted` are required for iOS Safari to autoplay. The poster shows instantly
// and on any device that blocks autoplay.
export function VideoBackground({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
      aria-hidden="true"
      className={cn("absolute inset-0 size-full object-cover", className)}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
