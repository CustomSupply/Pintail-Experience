"use client";

import MuxPlayer from "@mux/mux-player-react";

// Playback only — uses a public Mux playback ID, no server key needed.
// The asset is created in the Mux dashboard (or via the upload workflow);
// the author pastes its playback ID into the content editor.
export function AudioPlayer({
  playbackId,
  title,
}: {
  playbackId: string;
  title?: string;
}) {
  return (
    <MuxPlayer
      streamType="on-demand"
      playbackId={playbackId}
      audio
      accentColor="#e5c188"
      metadata={{ video_title: title ?? "Pintail audio" }}
      style={{ width: "100%" }}
    />
  );
}
