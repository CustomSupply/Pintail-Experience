import { redirect } from "next/navigation";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/page-transition";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!isStaff(user.role)) redirect("/home");

  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-border px-6 py-3">
          <span className="text-sm text-muted-foreground">
            {user.full_name ?? user.email}
          </span>
          <form action="/auth/signout" method="post">
            <Button type="submit" variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
