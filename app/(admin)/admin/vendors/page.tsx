import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, EmptyState } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export default async function VendorsAdminPage() {
  const supabase = await createClient();
  const { data: vendors, error } = await supabase
    .from("vendors")
    .select("id, name, role, featured")
    .order("name", { ascending: true });

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <PageHeader title="Vendors" subtitle="Lodge, handlers, photographer, partners." />
        <Link href="/admin/vendors/new" className={buttonVariants({ className: "mb-6" })}>
          New vendor
        </Link>
      </div>

      {error ? (
        <EmptyState>Couldn&apos;t load vendors: {error.message}</EmptyState>
      ) : !vendors || vendors.length === 0 ? (
        <EmptyState>No vendors yet.</EmptyState>
      ) : (
        <ul className="space-y-2">
          {vendors.map((v) => (
            <li key={v.id}>
              <Link
                href={`/admin/vendors/${v.id}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary"
              >
                <div>
                  <p className="font-serif text-lg">{v.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {v.role.replace(/_/g, " ")}
                  </p>
                </div>
                {v.featured && <Badge>featured</Badge>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
