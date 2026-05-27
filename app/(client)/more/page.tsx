import Link from "next/link";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { AdminLink } from "./admin-link";

export default async function MorePage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-6">
      <PageHeader title="More" />

      <Card>
        <CardContent className="space-y-1 pt-6">
          {user ? (
            <>
              <p className="font-serif text-lg">
                {user.full_name ?? "Your profile"}
              </p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </>
          ) : (
            <>
              <p className="font-serif text-lg">You&apos;re previewing</p>
              <p className="text-sm text-muted-foreground">
                Sign in to set up your profile, sign the waiver, and see who
                else is coming.
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <nav className="grid gap-2">
        <Link
          href="/devotionals"
          className={buttonVariants({ variant: "outline", className: "w-full justify-start" })}
        >
          Devotionals
        </Link>
        <Link
          href="/logistics"
          className={buttonVariants({ variant: "outline", className: "w-full justify-start" })}
        >
          Logistics &amp; info
        </Link>
        <Link
          href="/vendors"
          className={buttonVariants({ variant: "outline", className: "w-full justify-start" })}
        >
          The Hosting Team
        </Link>
        <Link
          href="/roster"
          className={buttonVariants({ variant: "outline", className: "w-full justify-start" })}
        >
          Who&apos;s coming
        </Link>
        {user && (
          <>
            <Link
              href="/waiver"
              className={buttonVariants({ variant: "outline", className: "w-full justify-start" })}
            >
              Sign the waiver
            </Link>
            <Link
              href="/onboarding"
              className={buttonVariants({ variant: "outline", className: "w-full justify-start" })}
            >
              Edit my profile
            </Link>
          </>
        )}
        <AdminLink staff={isStaff(user?.role)} />
      </nav>

      {user ? (
        <form action="/auth/signout" method="post">
          <Button type="submit" variant="ghost" className="w-full">
            Sign out
          </Button>
        </form>
      ) : (
        <Link href="/login" className={buttonVariants({ className: "w-full" })}>
          Sign in
        </Link>
      )}
    </div>
  );
}
