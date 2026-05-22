"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { publicPhotoUrl } from "@/lib/photos";

type Photo = { id: string; storage_path: string; caption: string | null };

export function PhotoGallery({
  initial,
  tripId,
}: {
  initial: Photo[];
  tripId: string | null;
}) {
  const [photos, setPhotos] = useState<Photo[]>(initial);
  const [active, setActive] = useState<Photo | null>(null);

  useEffect(() => {
    if (!tripId) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`photos-${tripId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "photos",
          filter: `trip_id=eq.${tripId}`,
        },
        (payload) => {
          const row = payload.new as Photo;
          setPhotos((prev) =>
            prev.some((p) => p.id === row.id) ? prev : [row, ...prev],
          );
          toast("A new photo just dropped.");
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tripId]);

  if (photos.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Photos will appear here in real time during the trip.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-1.5">
        {photos.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActive(p)}
            className="aspect-square overflow-hidden rounded-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={publicPhotoUrl(p.storage_path)}
              alt={p.caption ?? "Trip photo"}
              loading="lazy"
              className="size-full object-cover transition-transform hover:scale-105"
            />
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setActive(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={publicPhotoUrl(active.storage_path)}
            alt={active.caption ?? "Trip photo"}
            className="max-h-full max-w-full rounded-lg object-contain"
          />
        </div>
      )}
    </>
  );
}
