import { createClient } from "@/lib/supabase/server";
import { PageHeader, EmptyState } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";

export default async function TripsPage() {
  const supabase = await createClient();
  const { data: trips, error } = await supabase
    .from("trips")
    .select("id, name, slug, start_date, location, status")
    .order("start_date", { ascending: true });

  if (error) {
    return (
      <div>
        <PageHeader title="Trips" />
        <EmptyState>Couldn&apos;t load trips: {error.message}</EmptyState>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Trips" subtitle="Every Pintail Experience, past and future." />
      {!trips || trips.length === 0 ? (
        <EmptyState>No trips yet.</EmptyState>
      ) : (
        <ul className="space-y-3">
          {trips.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between rounded-lg border border-border p-4"
            >
              <div>
                <p className="font-heading text-lg">{t.name}</p>
                <p className="text-sm text-muted-foreground">
                  {t.location ?? "Location TBD"}
                  {t.start_date ? ` · ${t.start_date}` : ""}
                </p>
              </div>
              <Badge variant={t.status === "live" ? "default" : "secondary"}>
                {t.status}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
