import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { PageHeader } from "@/components/page-header";
import { PhotoUploader } from "./photo-uploader";
import { PhotoAdminGrid } from "./photo-admin-grid";

export default async function PhotosAdminPage() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  const { data: trip } = await supabase
    .from("trips")
    .select("id")
    .neq("status", "draft")
    .order("start_date", { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data: photos } = await supabase
    .from("photos")
    .select("id, storage_path, caption, public_visible, featured")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Photos"
        subtitle="Upload from the field. Toggle which appear in the public gallery."
      />
      <PhotoUploader tripId={trip?.id ?? null} userId={user!.id} />
      <PhotoAdminGrid photos={photos ?? []} />
    </div>
  );
}
