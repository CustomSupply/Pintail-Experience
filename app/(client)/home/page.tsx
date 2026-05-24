import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { stock } from "@/lib/stock";

function daysUntil(date: string | null): number | null {
  if (!date) return null;
  const ms = new Date(date).getTime() - Date.now();
  return ms <= 0 ? 0 : Math.ceil(ms / 86_400_000);
}

export default async function HomePage() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  const { data: trip } = await supabase
    .from("trips")
    .select("name, start_date, location")
    .neq("status", "draft")
    .order("start_date", { ascending: true })
    .limit(1)
    .maybeSingle();

  // Signed-in attendees get enrolled + a profile-completeness check.
  // Guests (preview) skip all of this.
  let attendee: { shirt_size: string | null } | null = null;
  if (user) {
    const { data: tripId } = await supabase.rpc("ensure_trip_enrollment");
    if (tripId) {
      const { data } = await supabase
        .from("trip_attendees")
        .select("shirt_size")
        .eq("trip_id", tripId)
        .eq("user_id", user.id)
        .maybeSingle();
      attendee = data;
    }
  }

  const { data: latestDevotional } = await supabase
    .from("devotionals")
    .select("id, title, scripture")
    .not("scheduled_for", "is", null)
    .lte("scheduled_for", new Date().toISOString())
    .order("scheduled_for", { ascending: false })
    .limit(1)
    .maybeSingle();

  const profileIncomplete = Boolean(user) && (!user?.full_name || !attendee?.shirt_size);
  const countdown = daysUntil(trip?.start_date ?? null);
  const firstName = user?.full_name?.split(" ")[0];

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-muted-foreground">Welcome back</p>
        <h1 className="font-display text-5xl leading-tight text-foreground">
          {firstName ?? "Friend"}
        </h1>
      </header>

      {profileIncomplete && (
        <Card className="border-primary/40">
          <CardHeader>
            <CardTitle className="font-serif text-lg">
              Finish setting up your profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Add your sizes, dietary needs, and a short bio so we can take care
              of you — and introduce you to the other men.
            </p>
            <Link href="/onboarding" className={buttonVariants({})}>
              Complete profile
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="relative overflow-hidden rounded-xl border border-primary/15">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${stock("goldenPortrait")})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pintail-night via-pintail-night/70 to-pintail-night/30" />
        <div className="relative p-5 pt-16">
          <p className="font-serif text-lg text-pintail-cream">
            {trip?.name ?? "The Pintail Experience"}
          </p>
          {countdown !== null ? (
            <p className="font-serif text-5xl text-primary">
              {countdown}
              <span className="ml-2 text-base text-pintail-cream/80">
                {countdown === 1 ? "day to go" : "days to go"}
              </span>
            </p>
          ) : (
            <p className="text-pintail-cream/80">
              Your trip details are coming soon.
            </p>
          )}
          {trip?.location && (
            <p className="text-sm text-pintail-cream/70">{trip.location}</p>
          )}
        </div>
      </div>

      {latestDevotional ? (
        <Link href={`/devotionals/${latestDevotional.id}`}>
          <Card className="transition-colors hover:border-primary">
            <CardHeader>
              <CardTitle className="text-sm font-normal text-primary">
                Latest devotional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-serif text-xl">{latestDevotional.title}</p>
              {latestDevotional.scripture && (
                <p className="mt-1 text-sm italic text-muted-foreground">
                  {latestDevotional.scripture}
                </p>
              )}
            </CardContent>
          </Card>
        </Link>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">What&apos;s next</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Devotionals, your schedule, and the curriculum library will appear
              here as the trip draws closer.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
