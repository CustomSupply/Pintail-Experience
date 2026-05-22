import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  const countdown = daysUntil(trip?.start_date ?? null);
  const firstName = user?.full_name?.split(" ")[0];

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-muted-foreground">Welcome back</p>
        <h1 className="font-display text-5xl leading-tight text-pintail-champagne">
          {firstName ?? "Friend"}
        </h1>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl">
            {trip?.name ?? "The Pintail Experience"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {countdown !== null ? (
            <p className="font-heading text-4xl text-primary">
              {countdown}
              <span className="ml-2 text-base text-muted-foreground">
                {countdown === 1 ? "day to go" : "days to go"}
              </span>
            </p>
          ) : (
            <p className="text-muted-foreground">
              Your trip details are coming soon.
            </p>
          )}
          {trip?.location && (
            <p className="text-sm text-muted-foreground">{trip.location}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">What&apos;s next</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Devotionals, your schedule, and the curriculum library will appear
            here as the trip draws closer.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
