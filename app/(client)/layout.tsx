import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { ClientBottomNav } from "@/components/client-bottom-nav";
import { PintailLockup } from "@/components/pintail-logo";
import { PageTransition } from "@/components/page-transition";
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";
import { stock } from "@/lib/stock";
import { getCurrentUser, isStaff } from "@/lib/auth";

// Open to guests during the build phase (no login) so the app can be shared
// by link. Pages handle the no-user case gracefully.
export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const staff = isStaff(user?.role);

  return (
    <div className="flex min-h-dvh flex-col">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center opacity-[0.05]"
        style={{ backgroundImage: `url(${stock("featherDetail")})` }}
      />
      <header className="sticky top-0 z-40 border-b border-primary/15 bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="relative mx-auto flex max-w-md items-center justify-center px-4 py-3">
          <Link href="/home" aria-label="The Pintail Experience home">
            <PintailLockup height={26} caption={false} />
          </Link>
          {staff && (
            <Link
              href="/admin"
              aria-label="Admin control room"
              className="absolute right-3 inline-flex items-center gap-1 rounded-md border border-primary/30 px-2 py-1 text-xs text-primary"
            >
              <ShieldCheck className="size-3.5" />
              Admin
            </Link>
          )}
        </div>
      </header>

      <div className="mx-auto w-full max-w-md flex-1 px-4 pt-5 pb-24">
        <PageTransition>{children}</PageTransition>
      </div>
      <PwaInstallPrompt />
      <ClientBottomNav />
    </div>
  );
}
