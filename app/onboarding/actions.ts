"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type OnboardingState = { ok: boolean; message: string };

function clean(formData: FormData, key: string): string | null {
  const v = String(formData.get(key) ?? "").trim();
  return v.length ? v : null;
}

export async function saveOnboarding(
  _prev: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "You're signed out. Please sign in again." };

  const fullName = clean(formData, "full_name");
  if (!fullName) return { ok: false, message: "Please enter your full name." };

  // Make sure the attendee is enrolled in the live trip before we update it.
  const { data: tripId, error: enrollError } = await supabase.rpc(
    "ensure_trip_enrollment",
  );
  if (enrollError) {
    console.error("ensure_trip_enrollment failed:", enrollError.message);
    return { ok: false, message: "Couldn't find an active trip to join." };
  }

  const { error: userError } = await supabase
    .from("users")
    .update({
      full_name: fullName,
      phone: clean(formData, "phone"),
      bio: clean(formData, "bio"),
      intro_note: clean(formData, "intro_note"),
    })
    .eq("id", user.id);

  if (userError) {
    console.error("profile update failed:", userError.message);
    return { ok: false, message: "Couldn't save your profile. Please try again." };
  }

  if (tripId) {
    const { error: attendeeError } = await supabase
      .from("trip_attendees")
      .update({
        shirt_size: clean(formData, "shirt_size"),
        jacket_size: clean(formData, "jacket_size"),
        hat_size: clean(formData, "hat_size"),
        glove_size: clean(formData, "glove_size"),
        boot_size: clean(formData, "boot_size"),
        dietary_notes: clean(formData, "dietary_notes"),
        room_preference: clean(formData, "room_preference"),
        prayer_request: clean(formData, "prayer_request"),
        roster_visible: formData.get("roster_visible") === "on",
      })
      .eq("trip_id", tripId)
      .eq("user_id", user.id);

    if (attendeeError) {
      console.error("attendee update failed:", attendeeError.message);
      return { ok: false, message: "Saved your profile, but trip details failed." };
    }
  }

  revalidatePath("/home");
  revalidatePath("/onboarding");
  return { ok: true, message: "Profile saved." };
}
