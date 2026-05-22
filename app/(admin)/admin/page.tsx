import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function count(
  table: "users" | "trips" | "inquiries",
): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });
  if (error) {
    console.error(`count(${table}) failed:`, error.message);
    return 0;
  }
  return count ?? 0;
}

export default async function AdminDashboard() {
  const [users, trips, inquiries] = await Promise.all([
    count("users"),
    count("trips"),
    count("inquiries"),
  ]);

  const stats = [
    { label: "People", value: users, href: "/admin/roster" },
    { label: "Trips", value: trips, href: "/admin/trips" },
    { label: "Inquiries", value: inquiries, href: "/admin/inquiries" },
  ];

  return (
    <div>
      <PageHeader
        title="Control Room"
        subtitle="Everything you need to run The Pintail Experience."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="transition-colors hover:border-primary">
              <CardHeader>
                <CardTitle className="text-sm font-normal text-muted-foreground">
                  {s.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-heading text-4xl">{s.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
