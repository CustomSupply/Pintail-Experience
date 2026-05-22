"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { saveDevotional, type DevotionalState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: DevotionalState = { ok: false, message: "" };

type Devotional = {
  id: string;
  title: string;
  scripture: string | null;
  day_offset: number;
  scheduled_for: string | null;
  written_content: string | null;
  audio_mux_id: string | null;
} | null;

// ISO -> value for <input type="datetime-local"> in the browser's local time.
function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function DevotionalForm({
  devotional,
  tripId,
}: {
  devotional: Devotional;
  tripId: string | null;
}) {
  const [state, formAction, pending] = useActionState(
    saveDevotional,
    initialState,
  );

  useEffect(() => {
    if (state.ok) toast.success(state.message);
    else if (state.message) toast.error(state.message);
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      {devotional && <input type="hidden" name="id" value={devotional.id} />}
      {tripId && <input type="hidden" name="trip_id" value={tripId} />}

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={devotional?.title ?? ""}
          placeholder="On the courage of Joshua"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="scripture">Scripture</Label>
        <Input
          id="scripture"
          name="scripture"
          defaultValue={devotional?.scripture ?? ""}
          placeholder="Joshua 1:9"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="day_offset">Day offset</Label>
          <Input
            id="day_offset"
            name="day_offset"
            type="number"
            defaultValue={devotional?.day_offset ?? 0}
            placeholder="-30 to +3"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="scheduled_for">Release at</Label>
          <Input
            id="scheduled_for"
            name="scheduled_for"
            type="datetime-local"
            defaultValue={toLocalInput(devotional?.scheduled_for ?? null)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="written_content">Content (Markdown)</Label>
        <Textarea
          id="written_content"
          name="written_content"
          rows={14}
          className="font-mono text-sm"
          defaultValue={devotional?.written_content ?? ""}
          placeholder={"Write the devotional in Markdown.\n\n## A heading\n\nA paragraph, *emphasis*, and a > blockquote."}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="audio_mux_id">Mux audio playback ID (optional)</Label>
        <Input
          id="audio_mux_id"
          name="audio_mux_id"
          defaultValue={devotional?.audio_mux_id ?? ""}
          placeholder="Paste from the Mux dashboard after uploading"
        />
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving…" : devotional ? "Save devotional" : "Create devotional"}
      </Button>
    </form>
  );
}
