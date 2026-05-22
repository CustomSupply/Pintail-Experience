"use server";

import { createClient } from "@/lib/supabase/server";

export type InquiryState = { ok: boolean; message: string };

export async function submitInquiry(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const message = String(formData.get("message") ?? "").trim() || null;

  if (!name || !email) {
    return { ok: false, message: "Name and email are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").insert({
    name,
    email,
    phone,
    message,
    trip_interest: "the-pintail-experience",
  });

  if (error) {
    console.error("submitInquiry failed:", error.message);
    return { ok: false, message: "Something went wrong. Please try again." };
  }

  return {
    ok: true,
    message: "Thank you — we'll be in touch about future trips.",
  };
}
