import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { PhotoGallery } from "./photo-gallery";

export default async function PhotosPage() {
  const supabase = await createClient();

  const { data: trip } = await supabase
    .from("trips")
    .select("id")
    .neq("status", "draft")
    .order("start_date", { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data: photos } = await supabase
    .from("photos")
    .select("id, storage_path, caption")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="Photos" subtitle="The trip, as it happens." />
      <PhotoGallery initial={photos ?? []} tripId={trip?.id ?? null} />
    </div>
  );
}
