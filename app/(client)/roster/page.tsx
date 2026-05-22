import { createClient } from "@/lib/supabase/server";
import { PageHeader, EmptyState } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";

function initials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function RosterPage() {
  const supabase = await createClient();

  const { data: tripId } = await supabase.rpc("ensure_trip_enrollment");

  const { data: roster, error } = tripId
    ? await supabase.rpc("get_trip_roster", { p_trip: tripId })
    : { data: [], error: null };

  return (
    <div>
      <PageHeader
        title="Who's coming"
        subtitle="The men you'll share the blind, the table, and the trip with."
      />

      {error ? (
        <EmptyState>Couldn&apos;t load the roster right now.</EmptyState>
      ) : !roster || roster.length === 0 ? (
        <EmptyState>
          Bios appear here as the other men complete their profiles.
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {roster.map((person) => (
            <li key={person.user_id}>
              <Card>
                <CardContent className="flex gap-4 pt-6">
                  <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-sm font-medium text-primary">
                    {person.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={person.avatar_url}
                        alt={person.full_name ?? "Attendee"}
                        className="size-full object-cover"
                      />
                    ) : (
                      initials(person.full_name)
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-serif text-lg leading-tight">
                      {person.full_name ?? "An attendee"}
                    </p>
                    {person.bio && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {person.bio}
                      </p>
                    )}
                    {person.intro_note && (
                      <p className="mt-2 border-l-2 border-primary/40 pl-3 text-sm italic text-muted-foreground">
                        {person.intro_note}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
