import { createClient } from "@/lib/supabase/server";
import { PageHeader, EmptyState } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";

export default async function RosterPage() {
  const supabase = await createClient();
  const { data: people, error } = await supabase
    .from("users")
    .select("id, full_name, email, role, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    return (
      <div>
        <PageHeader title="Roster" />
        <EmptyState>Couldn&apos;t load the roster: {error.message}</EmptyState>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Roster"
        subtitle={`${people?.length ?? 0} ${
          (people?.length ?? 0) === 1 ? "person" : "people"
        } in the system.`}
      />

      {!people || people.length === 0 ? (
        <EmptyState>
          No one has been added yet. Attendees appear here once they&apos;re
          invited.
        </EmptyState>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {people.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">{p.full_name ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{p.role}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
