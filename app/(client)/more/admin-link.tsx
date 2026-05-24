"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";

// Shown to everyone. Staff go to the control room; everyone else gets a
// "staff access only" note instead of navigating.
export function AdminLink({ staff }: { staff: boolean }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() =>
        staff
          ? router.push("/admin")
          : toast.error("Staff access only.")
      }
      className={buttonVariants({
        variant: "outline",
        className: "w-full justify-start",
      })}
    >
      Admin
    </button>
  );
}
