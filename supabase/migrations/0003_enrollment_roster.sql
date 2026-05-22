-- Phase 2: self-enrollment into the live trip + an opt-in roster reader.

-- Enroll the calling user in the current live trip (idempotent). Returns the
-- trip id they're enrolled in, or null if there's no live trip. SECURITY
-- DEFINER so a plain attendee can create their own trip_attendees row without
-- a broad insert policy.
create or replace function public.ensure_trip_enrollment()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_trip uuid;
begin
  if auth.uid() is null then
    return null;
  end if;

  select id into v_trip
  from public.trips
  where status = 'live'
  order by start_date asc nulls last
  limit 1;

  if v_trip is null then
    return null;
  end if;

  insert into public.trip_attendees (trip_id, user_id)
  values (v_trip, auth.uid())
  on conflict (trip_id, user_id) do nothing;

  return v_trip;
end;
$$;

-- Limited, opt-in roster for a trip: only the columns attendees should see of
-- one another, and only for those who set roster_visible. The caller must be
-- an attendee of that trip (or staff), enforced inside the function.
create or replace function public.get_trip_roster(p_trip uuid)
returns table (
  user_id uuid,
  full_name text,
  avatar_url text,
  bio text,
  intro_note text
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not (
    public.has_staff_access()
    or exists (
      select 1 from public.trip_attendees ta
      where ta.trip_id = p_trip and ta.user_id = auth.uid()
    )
  ) then
    return;
  end if;

  return query
  select u.id, u.full_name, u.avatar_url, u.bio, u.intro_note
  from public.trip_attendees ta
  join public.users u on u.id = ta.user_id
  where ta.trip_id = p_trip
    and ta.roster_visible = true
  order by u.full_name nulls last;
end;
$$;

revoke execute on function public.ensure_trip_enrollment() from public, anon;
revoke execute on function public.get_trip_roster(uuid) from public, anon;
grant execute on function public.ensure_trip_enrollment() to authenticated;
grant execute on function public.get_trip_roster(uuid) to authenticated;
