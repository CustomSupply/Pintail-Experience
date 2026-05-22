// Public URL for an object in the public 'photos' bucket. The bucket is
// public, so this is a stable URL with no signing required.
export function publicPhotoUrl(storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${base}/storage/v1/object/public/photos/${storagePath}`;
}
