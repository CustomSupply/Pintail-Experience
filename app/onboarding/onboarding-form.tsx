"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { saveOnboarding, type OnboardingState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

type Profile = {
  full_name: string | null;
  phone: string | null;
  bio: string | null;
  intro_note: string | null;
} | null;

type Attendee = {
  shirt_size: string | null;
  jacket_size: string | null;
  hat_size: string | null;
  glove_size: string | null;
  boot_size: string | null;
  dietary_notes: string | null;
  room_preference: string | null;
  prayer_request: string | null;
  roster_visible: boolean;
} | null;

const initialState: OnboardingState = { ok: false, message: "" };

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="font-serif text-lg">{title}</h2>
      {description && (
        <p className="mt-1 mb-4 text-sm text-muted-foreground">{description}</p>
      )}
      <div className={description ? "space-y-4" : "mt-4 space-y-4"}>
        {children}
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  defaultValue,
  placeholder,
  type = "text",
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
      />
    </div>
  );
}

export function OnboardingForm({
  profile,
  attendee,
}: {
  profile: Profile;
  attendee: Attendee;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    saveOnboarding,
    initialState,
  );

  useEffect(() => {
    if (state.ok) {
      toast.success(state.message);
      router.push("/home");
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-6">
      <Section title="About you">
        <Field
          name="full_name"
          label="Full name"
          defaultValue={profile?.full_name}
          placeholder="John Doe"
        />
        <Field
          name="phone"
          label="Phone"
          type="tel"
          defaultValue={profile?.phone}
          placeholder="(555) 555-5555"
        />
        <div className="space-y-2">
          <Label htmlFor="bio">Short bio</Label>
          <Textarea
            id="bio"
            name="bio"
            rows={3}
            defaultValue={profile?.bio ?? ""}
            placeholder="Atlanta, GA. Husband, dad of 3, plant-shop owner, hunting ducks since I was 8."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="intro_note">A note to the other men (optional)</Label>
          <Textarea
            id="intro_note"
            name="intro_note"
            rows={2}
            defaultValue={profile?.intro_note ?? ""}
            placeholder="Looking forward to meeting everyone."
          />
        </div>
        <label className="flex items-start gap-3 text-sm">
          <Checkbox
            name="roster_visible"
            defaultChecked={attendee?.roster_visible ?? true}
            className="mt-0.5"
          />
          <span className="text-muted-foreground">
            Show my name and bio on the attendee roster so others can see who
            else is coming.
          </span>
        </label>
      </Section>

      <Section
        title="Sizes"
        description="For the gear and apparel waiting for you at the lodge."
      >
        <div className="grid grid-cols-2 gap-4">
          <Field name="shirt_size" label="Shirt" defaultValue={attendee?.shirt_size} placeholder="L" />
          <Field name="jacket_size" label="Jacket" defaultValue={attendee?.jacket_size} placeholder="L" />
          <Field name="hat_size" label="Hat" defaultValue={attendee?.hat_size} placeholder="7 3/8" />
          <Field name="glove_size" label="Glove" defaultValue={attendee?.glove_size} placeholder="L" />
          <Field name="boot_size" label="Boot" defaultValue={attendee?.boot_size} placeholder="11" />
        </div>
      </Section>

      <Section title="On the trip">
        <div className="space-y-2">
          <Label htmlFor="dietary_notes">Dietary needs or allergies</Label>
          <Textarea
            id="dietary_notes"
            name="dietary_notes"
            rows={2}
            defaultValue={attendee?.dietary_notes ?? ""}
            placeholder="Tree-nut allergy; otherwise no restrictions."
          />
        </div>
        <Field
          name="room_preference"
          label="Room preference (optional)"
          defaultValue={attendee?.room_preference}
          placeholder="Early riser — happy to bunk with another."
        />
        <div className="space-y-2">
          <Label htmlFor="prayer_request">Prayer request (optional)</Label>
          <Textarea
            id="prayer_request"
            name="prayer_request"
            rows={2}
            defaultValue={attendee?.prayer_request ?? ""}
            placeholder="Anything you'd like the group to be praying over."
          />
        </div>
      </Section>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Saving…" : "Save my profile"}
      </Button>
    </form>
  );
}
