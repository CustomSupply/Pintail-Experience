import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { VendorForm } from "../vendor-form";
import { deleteVendor } from "../actions";

export default async function EditVendorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: vendor } = await supabase
    .from("vendors")
    .select(
      "id, name, slug, role, description, website_url, contact_name, contact_phone, logo_url, featured_photo_url, featured",
    )
    .eq("id", id)
    .maybeSingle();

  if (!vendor) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/vendors"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to vendors
      </Link>
      <div className="mt-2 flex items-start justify-between gap-4">
        <PageHeader title="Edit vendor" />
        <form action={deleteVendor}>
          <input type="hidden" name="id" value={vendor.id} />
          <Button type="submit" variant="ghost" size="sm" className="mt-1 text-destructive">
            Delete
          </Button>
        </form>
      </div>
      <VendorForm vendor={vendor} />
    </div>
  );
}
