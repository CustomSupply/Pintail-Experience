import Link from "next/link";
import { ClientBottomNav } from "@/components/client-bottom-nav";
import { PintailLockup } from "@/components/pintail-logo";
import { PageTransition } from "@/components/page-transition";
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";
import { stock } from "@/lib/stock";

// Open to guests during the build phase (no login) so the app can be shared
// by link. Pages handle the no-user case gracefully.
export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center opacity-[0.05]"
        style={{ backgroundImage: `url(${stock("featherDetail")})` }}
      />
      <header className="sticky top-0 z-40 border-b border-primary/15 bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex max-w-md items-center justify-center px-4 py-3">
          <Link href="/home" aria-label="The Pintail Experience home">
            <PintailLockup height={26} caption={false} />
          </Link>
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
