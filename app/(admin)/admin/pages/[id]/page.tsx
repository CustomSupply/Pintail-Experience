import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PageForm } from "../page-form";
import { deletePage } from "../actions";

export default async function EditTripPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: page } = await supabase
    .from("trip_pages")
    .select("id, title, slug, content, sort_order, visible")
    .eq("id", id)
    .maybeSingle();

  if (!page) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/pages"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to logistics
      </Link>
      <div className="mt-2 flex items-start justify-between gap-4">
        <PageHeader title="Edit info page" />
        <form action={deletePage}>
          <input type="hidden" name="id" value={page.id} />
          <Button type="submit" variant="ghost" size="sm" className="mt-1 text-destructive">
            Delete
          </Button>
        </form>
      </div>
      <PageForm page={page} tripId={null} />
    </div>
  );
}
