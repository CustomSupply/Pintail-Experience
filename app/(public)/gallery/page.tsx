import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PhotoGallery } from "@/app/(client)/photos/photo-gallery";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Gallery · The Pintail Experience",
};

export default async function PublicGalleryPage() {
  const supabase = await createClient();
  const { data: photos } = await supabase
    .from("photos")
    .select("id, storage_path, caption")
    .eq("public_visible", true)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <header className="mb-8 text-center">
        <Link
          href="/"
          className="font-display text-4xl text-pintail-champagne"
        >
          The Pintail Experience
        </Link>
        <p className="mt-3 text-sm text-muted-foreground">
          Moments from the field.
        </p>
      </header>

      {!photos || photos.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          The gallery opens after the trip.
        </p>
      ) : (
        <PhotoGallery initial={photos} tripId={null} />
      )}

      <div className="mt-12 text-center">
        <Link href="/#inquire" className={buttonVariants({ size: "lg" })}>
          Request an invitation
        </Link>
      </div>
    </main>
  );
}
