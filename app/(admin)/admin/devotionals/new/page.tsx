import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { DevotionalForm } from "../devotional-form";

export default async function NewDevotionalPage() {
  const supabase = await createClient();
  const { data: trip } = await supabase
    .from("trips")
    .select("id")
    .neq("status", "draft")
    .order("start_date", { ascending: true })
    .limit(1)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/devotionals"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to devotionals
      </Link>
      <div className="mt-2">
        <PageHeader title="New devotional" />
      </div>
      <DevotionalForm devotional={null} tripId={trip?.id ?? null} />
    </div>
  );
}
