import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Markdown } from "@/components/markdown";
import { AudioPlayer } from "@/components/audio-player";

export default async function DevotionalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: devotional } = await supabase
    .from("devotionals")
    .select("title, scripture, written_content, audio_mux_id, scheduled_for")
    .eq("id", id)
    .maybeSingle();

  const released =
    devotional?.scheduled_for &&
    new Date(devotional.scheduled_for).getTime() <= Date.now();
  if (!devotional || !released) notFound();

  return (
    <article className="space-y-5">
      <Link
        href="/devotionals"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Devotionals
      </Link>

      <header>
        <h1 className="font-serif text-3xl leading-tight">{devotional.title}</h1>
        {devotional.scripture && (
          <p className="mt-2 italic text-primary">{devotional.scripture}</p>
        )}
      </header>

      {devotional.audio_mux_id && (
        <AudioPlayer
          playbackId={devotional.audio_mux_id}
          title={devotional.title}
        />
      )}

      {devotional.written_content && (
        <Markdown>{devotional.written_content}</Markdown>
      )}
    </article>
  );
}
