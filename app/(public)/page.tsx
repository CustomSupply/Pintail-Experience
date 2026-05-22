import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { InquiryForm } from "./inquiry-form";
import { buttonVariants } from "@/components/ui/button";

function daysUntil(date: string | null): number | null {
  if (!date) return null;
  const ms = new Date(date).getTime() - Date.now();
  return ms <= 0 ? 0 : Math.ceil(ms / 86_400_000);
}

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: trip } = await supabase
    .from("trips")
    .select("name, start_date, location, description")
    .neq("status", "draft")
    .order("start_date", { ascending: true })
    .limit(1)
    .maybeSingle();

  const countdown = daysUntil(trip?.start_date ?? null);

  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-background to-card" />
        <div className="relative z-10 max-w-2xl">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-primary">
            A Faith-Based Hunting Retreat
          </p>
          <h1 className="font-heading text-5xl italic leading-tight tracking-tight sm:text-7xl">
            The Pintail Experience
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-balance text-lg text-muted-foreground">
            Three days in the blind. A lifetime of brotherhood. A curated,
            faith-centered hunting retreat for men who want more than a trophy.
          </p>

          {countdown !== null && (
            <p className="mt-8 font-heading text-lg text-primary">
              {countdown === 0
                ? "The trip is here."
                : `${countdown} days until the first hunt.`}
            </p>
          )}

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="#inquire" className={buttonVariants({ size: "lg" })}>
              Request an invitation
            </Link>
            <Link
              href="/login"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Attendee sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="border-t border-border bg-card px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl italic tracking-tight">
            The trip lasts three days. The experience lasts forever.
          </h2>
          <p className="mt-6 text-muted-foreground">
            From the day you&apos;re confirmed, this experience lives in your
            pocket — a daily devotional in the lead-up, the run-of-show in your
            hand on the water, and an archive of every teaching session, every
            photo, and the closing blessing long after you&apos;ve flown home.
          </p>
        </div>
      </section>

      {/* What to expect */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-3">
          {[
            {
              title: "Dawn in the blind",
              body: "Guided hunts at first light with seasoned handlers and working dogs.",
            },
            {
              title: "Fire-lit teaching",
              body: "Daily curriculum and devotionals built around Scripture and brotherhood.",
            },
            {
              title: "A lasting archive",
              body: "Photos, audio, and the closing blessing — yours to keep forever.",
            },
          ].map((card) => (
            <div key={card.title} className="rounded-lg border border-border p-6">
              <h3 className="font-heading text-xl">{card.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Inquiry */}
      <section
        id="inquire"
        className="border-t border-border bg-card px-6 py-20"
      >
        <div className="mx-auto max-w-xl">
          <div className="mb-8 text-center">
            <h2 className="font-heading text-3xl italic tracking-tight">
              Inquire about a future trip
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Spots are limited and by invitation. Tell us about yourself and
              we&apos;ll reach out.
            </p>
          </div>
          <InquiryForm />
        </div>
      </section>

      <footer className="border-t border-border px-6 py-10 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} The Pintail Experience.
      </footer>
    </main>
  );
}
