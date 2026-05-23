-- Build-phase guest preview: let anonymous visitors READ the attendee-facing
-- content (so a no-login share link shows a populated app). Mirrors the
-- authenticated read conditions. Reverse these before loading real attendees.
-- trips / vendors / photos already permit the relevant anon reads.

create policy schedule_anon_read on public.schedule_items
  for select to anon using (visible_to_attendees = true);

create policy curriculum_anon_read on public.curriculum_sessions
  for select to anon using (published_at is not null);

create policy devotionals_anon_read on public.devotionals
  for select to anon using (scheduled_for is not null and scheduled_for <= now());

create policy trip_pages_anon_read on public.trip_pages
  for select to anon using (visible = true);
