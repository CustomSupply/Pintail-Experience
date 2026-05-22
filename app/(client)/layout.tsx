import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ClientBottomNav } from "@/components/client-bottom-nav";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="mx-auto w-full max-w-md flex-1 px-4 pt-6 pb-24">
        {children}
      </div>
      <ClientBottomNav />
    </div>
  );
}
