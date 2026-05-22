import Link from "next/link";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";

export default async function MorePage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-6">
      <PageHeader title="More" />

      <Card>
        <CardContent className="space-y-1 pt-6">
          <p className="font-serif text-lg">
            {user?.full_name ?? "Your profile"}
          </p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <p className="text-xs uppercase tracking-wide text-primary">
            {user?.role}
          </p>
        </CardContent>
      </Card>

      <nav className="grid gap-2">
        <Link
          href="/roster"
          className={buttonVariants({ variant: "outline", className: "w-full justify-start" })}
        >
          Who&apos;s coming
        </Link>
        <Link
          href="/onboarding"
          className={buttonVariants({ variant: "outline", className: "w-full justify-start" })}
        >
          Edit my profile
        </Link>
        {isStaff(user?.role) && (
          <Link
            href="/admin"
            className={buttonVariants({ variant: "outline", className: "w-full justify-start" })}
          >
            Open admin control room
          </Link>
        )}
      </nav>

      <form action="/auth/signout" method="post">
        <Button type="submit" variant="ghost" className="w-full">
          Sign out
        </Button>
      </form>
    </div>
  );
}
