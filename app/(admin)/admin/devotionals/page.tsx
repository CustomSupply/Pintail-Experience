import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, EmptyState } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

function status(scheduledFor: string | null): {
  label: string;
  variant: "default" | "secondary";
} {
  if (!scheduledFor) return { label: "draft", variant: "secondary" };
  return new Date(scheduledFor).getTime() <= Date.now()
    ? { label: "released", variant: "default" }
    : { label: "scheduled", variant: "secondary" };
}

export default async function DevotionalsAdminPage() {
  const supabase = await createClient();
  const { data: devotionals, error } = await supabase
    .from("devotionals")
    .select("id, title, scripture, day_offset, scheduled_for, audio_mux_id")
    .order("day_offset", { ascending: true });

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <PageHeader
          title="Devotionals"
          subtitle="The pre-trip daily drip and beyond."
        />
        <Link
          href="/admin/devotionals/new"
          className={buttonVariants({ className: "mb-6" })}
        >
          New devotional
        </Link>
      </div>

      {error ? (
        <EmptyState>Couldn&apos;t load devotionals: {error.message}</EmptyState>
      ) : !devotionals || devotionals.length === 0 ? (
        <EmptyState>No devotionals yet. Write the first one.</EmptyState>
      ) : (
        <ul className="space-y-2">
          {devotionals.map((d) => {
            const s = status(d.scheduled_for);
            return (
              <li key={d.id}>
                <Link
                  href={`/admin/devotionals/${d.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary"
                >
                  <div className="min-w-0">
                    <p className="truncate font-serif text-lg">{d.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Day {d.day_offset}
                      {d.scripture ? ` · ${d.scripture}` : ""}
                      {d.audio_mux_id ? " · audio" : ""}
                    </p>
                  </div>
                  <Badge variant={s.variant}>{s.label}</Badge>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
