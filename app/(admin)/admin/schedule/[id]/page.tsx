import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ScheduleForm } from "../schedule-form";
import { deleteScheduleItem } from "../actions";

export default async function EditScheduleItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: item } = await supabase
    .from("schedule_items")
    .select(
      "id, day_number, start_time, end_time, title, description, location, category, visible_to_attendees",
    )
    .eq("id", id)
    .maybeSingle();

  if (!item) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/schedule"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to schedule
      </Link>
      <div className="mt-2 flex items-start justify-between gap-4">
        <PageHeader title="Edit schedule item" />
        <form action={deleteScheduleItem}>
          <input type="hidden" name="id" value={item.id} />
          <Button type="submit" variant="ghost" size="sm" className="mt-1 text-destructive">
            Delete
          </Button>
        </form>
      </div>
      <ScheduleForm item={item} tripId={null} />
    </div>
  );
}
