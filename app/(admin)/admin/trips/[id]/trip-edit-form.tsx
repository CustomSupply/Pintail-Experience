"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { updateTrip, type TripState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

const initialState: TripState = { ok: false, message: "" };

export function TripEditForm({
  trip,
}: {
  trip: {
    id: string;
    name: string;
    location: string | null;
    start_date: string | null;
    end_date: string | null;
    description: string | null;
    status: string;
  };
}) {
  const [state, formAction, pending] = useActionState(updateTrip, initialState);

  useEffect(() => {
    if (state.ok) toast.success(state.message);
    else if (state.message) toast.error(state.message);
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={trip.id} />

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={trip.name} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          defaultValue={trip.location ?? ""}
          placeholder="To be announced"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Start date</Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            defaultValue={trip.start_date ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_date">End date</Label>
          <Input
            id="end_date"
            name="end_date"
            type="date"
            defaultValue={trip.end_date ?? ""}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          defaultValue={trip.status}
          className={selectClass}
        >
          <option value="draft">draft (hidden from public)</option>
          <option value="live">live (visible)</option>
          <option value="past">past</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={trip.description ?? ""}
        />
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving…" : "Save trip"}
      </Button>
    </form>
  );
}
