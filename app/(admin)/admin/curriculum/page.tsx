import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, EmptyState } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export default async function CurriculumAdminPage() {
  const supabase = await createClient();
  const { data: sessions, error } = await supabase
    .from("curriculum_sessions")
    .select("id, session_number, title, scripture_reference, published_at")
    .order("session_number", { ascending: true });

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <PageHeader
          title="Curriculum"
          subtitle="The teaching sessions, in text and audio."
        />
        <Link
          href="/admin/curriculum/new"
          className={buttonVariants({ className: "mb-6" })}
        >
          New session
        </Link>
      </div>

      {error ? (
        <EmptyState>Couldn&apos;t load sessions: {error.message}</EmptyState>
      ) : !sessions || sessions.length === 0 ? (
        <EmptyState>No sessions yet.</EmptyState>
      ) : (
        <ul className="space-y-2">
          {sessions.map((s) => (
            <li key={s.id}>
              <Link
                href={`/admin/curriculum/${s.id}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary"
              >
                <div className="min-w-0">
                  <p className="truncate font-serif text-lg">
                    Session {s.session_number}: {s.title}
                  </p>
                  {s.scripture_reference && (
                    <p className="text-sm text-muted-foreground">
                      {s.scripture_reference}
                    </p>
                  )}
                </div>
                <Badge variant={s.published_at ? "default" : "secondary"}>
                  {s.published_at ? "published" : "draft"}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
