"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { saveCurriculum, type CurriculumState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const initialState: CurriculumState = { ok: false, message: "" };

type Session = {
  id: string;
  session_number: number;
  title: string;
  scripture_reference: string | null;
  written_content: string | null;
  audio_mux_id: string | null;
  video_mux_id: string | null;
  discussion_questions: string[];
  published_at: string | null;
} | null;

export function CurriculumForm({
  session,
  tripId,
}: {
  session: Session;
  tripId: string | null;
}) {
  const [state, formAction, pending] = useActionState(
    saveCurriculum,
    initialState,
  );

  useEffect(() => {
    if (state.ok) toast.success(state.message);
    else if (state.message) toast.error(state.message);
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      {session && <input type="hidden" name="id" value={session.id} />}
      {tripId && <input type="hidden" name="trip_id" value={tripId} />}

      <div className="grid grid-cols-[120px_1fr] gap-4">
        <div className="space-y-2">
          <Label htmlFor="session_number">Session #</Label>
          <Input
            id="session_number"
            name="session_number"
            type="number"
            min={1}
            defaultValue={session?.session_number ?? 1}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            defaultValue={session?.title ?? ""}
            placeholder="The weight of a calling"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="scripture_reference">Scripture reference</Label>
        <Input
          id="scripture_reference"
          name="scripture_reference"
          defaultValue={session?.scripture_reference ?? ""}
          placeholder="1 Kings 19:11-13"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="written_content">Teaching content (Markdown)</Label>
        <Textarea
          id="written_content"
          name="written_content"
          rows={16}
          className="font-mono text-sm"
          defaultValue={session?.written_content ?? ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="discussion_questions">
          Discussion questions (one per line)
        </Label>
        <Textarea
          id="discussion_questions"
          name="discussion_questions"
          rows={4}
          defaultValue={(session?.discussion_questions ?? []).join("\n")}
          placeholder={"What is God calling you toward?\nWhere have you been resisting?"}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="audio_mux_id">Audio Mux ID</Label>
          <Input
            id="audio_mux_id"
            name="audio_mux_id"
            defaultValue={session?.audio_mux_id ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="video_mux_id">Video Mux ID</Label>
          <Input
            id="video_mux_id"
            name="video_mux_id"
            defaultValue={session?.video_mux_id ?? ""}
          />
        </div>
      </div>

      <label className="flex items-center gap-3 text-sm">
        <Checkbox name="published" defaultChecked={Boolean(session?.published_at)} />
        <span>Published (visible to attendees)</span>
      </label>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving…" : session ? "Save session" : "Create session"}
      </Button>
    </form>
  );
}
