"use client";

import { usePathname } from "next/navigation";

// Re-keys on navigation so the rise animation replays for each page.
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="animate-rise">
      {children}
    </div>
  );
}
