-- Pintail Experience — initial schema (Phase 1)
-- 12 tables, role-based RLS. Single trip in v1; schema supports many.

-- ============================================================
-- Enums
-- ============================================================
create type user_role as enum ('attendee', 'founder', 'father_in_law', 'vendor', 'admin');
create type trip_status as enum ('draft', 'live', 'past');
create type schedule_category as enum ('hunt', 'meal', 'teaching', 'rest', 'travel', 'special');
create type vendor_role as enum ('lodge', 'dog_handler', 'photographer', 'leather_goods', 'speaker', 'other');
create type announcement_channel as enum ('in_app', 'push', 'email', 'all');
create type payment_status as enum ('unpaid', 'deposit', 'paid_in_full', 'refunded');
create type inquiry_status as enum ('new', 'contacted', 'qualified', 'closed');

-- ============================================================
-- Tables
-- ============================================================

-- Mirrors auth.users; id MUST equal auth.users.id (enforced by trigger below).
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role user_role not null default 'attendee',
  full_name text,
  phone text,
  avatar_url text,
  bio text,
  intro_note text,
  created_at timestamptz not null default now(),
  last_active_at timestamptz
);

create table public.vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  role vendor_role not null default 'other',
  description text,
  logo_url text,
  website_url text,
  contact_name text,
  contact_phone text,
  featured_photo_url text,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  start_date date,
  end_date date,
  location text,
  lodge_id uuid references public.vendors (id) on delete set null,
  description text,
  hero_image_url text,
  brand_film_mux_id text,
  status trip_status not null default 'draft',
  created_at timestamptz not null default now()
);

create table public.trip_attendees (
  trip_id uuid not null references public.trips (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  shirt_size text,
  jacket_size text,
  hat_size text,
  glove_size text,
  boot_size text,
  dietary_notes text,
  room_preference text,
  room_assignment text,
  payment_status payment_status not null default 'unpaid',
  deposit_paid_at timestamptz,
  balance_paid_at timestamptz,
  waiver_signed_at timestamptz,
  waiver_image_url text,
  prayer_request text,
  arrival_info text,
  departure_info text,
  roster_visible boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (trip_id, user_id)
);

create table public.schedule_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips (id) on delete cascade,
  day_number int not null,
  start_time time,
  end_time time,
  title text not null,
  description text,
  location text,
  category schedule_category not null default 'special',
  visible_to_attendees boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.curriculum_sessions (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips (id) on delete cascade,
  session_number int not null,
  title text not null,
  scripture_reference text,
  written_content text,
  audio_mux_id text,
  video_mux_id text,
  discussion_questions jsonb not null default '[]'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.devotionals (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips (id) on delete cascade,
  day_offset int not null,
  title text not null,
  scripture text,
  written_content text,
  audio_mux_id text,
  scheduled_for timestamptz,
  created_at timestamptz not null default now()
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips (id) on delete cascade,
  created_by uuid references public.users (id) on delete set null,
  title text not null,
  body text,
  channel announcement_channel not null default 'in_app',
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.photos (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips (id) on delete cascade,
  uploaded_by uuid references public.users (id) on delete set null,
  storage_path text not null,
  thumbnail_path text,
  caption text,
  taken_at timestamptz,
  featured boolean not null default false,
  public_visible boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.waivers (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  signed_at timestamptz not null default now(),
  signature_image_path text,
  ip_address text,
  document_version text
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text,
  trip_interest text,
  status inquiry_status not null default 'new',
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index idx_trip_attendees_user on public.trip_attendees (user_id);
create index idx_schedule_items_trip on public.schedule_items (trip_id, day_number);
create index idx_curriculum_trip on public.curriculum_sessions (trip_id);
create index idx_devotionals_trip on public.devotionals (trip_id);
create index idx_announcements_trip on public.announcements (trip_id);
create index idx_photos_trip on public.photos (trip_id);

-- ============================================================
-- Role helpers (SECURITY DEFINER to avoid RLS recursion on users)
-- ============================================================
create or replace function public.has_staff_access()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role in ('founder', 'admin')
  );
$$;

create or replace function public.has_content_access()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role in ('founder', 'admin', 'father_in_law')
  );
$$;

-- ============================================================
-- New-user trigger: keep public.users in sync with auth.users
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Enable RLS
-- ============================================================
alter table public.users enable row level security;
alter table public.vendors enable row level security;
alter table public.trips enable row level security;
alter table public.trip_attendees enable row level security;
alter table public.schedule_items enable row level security;
alter table public.curriculum_sessions enable row level security;
alter table public.devotionals enable row level security;
alter table public.announcements enable row level security;
alter table public.photos enable row level security;
alter table public.waivers enable row level security;
alter table public.inquiries enable row level security;

-- ---------------- users ----------------
create policy users_select_own_or_content on public.users
  for select using (id = auth.uid() or public.has_content_access());
create policy users_update_own on public.users
  for update using (id = auth.uid()) with check (id = auth.uid());
create policy users_staff_all on public.users
  for all using (public.has_staff_access()) with check (public.has_staff_access());

-- ---------------- vendors ----------------
create policy vendors_public_featured on public.vendors
  for select to anon using (featured = true);
create policy vendors_auth_read on public.vendors
  for select to authenticated using (true);
create policy vendors_staff_write on public.vendors
  for all to authenticated using (public.has_staff_access()) with check (public.has_staff_access());

-- ---------------- trips ----------------
create policy trips_public_nondraft on public.trips
  for select to anon using (status <> 'draft');
create policy trips_auth_read on public.trips
  for select to authenticated using (true);
create policy trips_staff_write on public.trips
  for all to authenticated using (public.has_staff_access()) with check (public.has_staff_access());

-- ---------------- trip_attendees ----------------
create policy trip_attendees_select_own_or_staff on public.trip_attendees
  for select to authenticated using (user_id = auth.uid() or public.has_content_access());
create policy trip_attendees_update_own on public.trip_attendees
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy trip_attendees_staff_write on public.trip_attendees
  for all to authenticated using (public.has_staff_access()) with check (public.has_staff_access());

-- ---------------- schedule_items ----------------
create policy schedule_attendee_read on public.schedule_items
  for select to authenticated using (visible_to_attendees = true or public.has_content_access());
create policy schedule_staff_write on public.schedule_items
  for all to authenticated using (public.has_staff_access()) with check (public.has_staff_access());

-- ---------------- curriculum_sessions ----------------
create policy curriculum_read on public.curriculum_sessions
  for select to authenticated using (published_at is not null or public.has_content_access());
create policy curriculum_content_write on public.curriculum_sessions
  for all to authenticated using (public.has_content_access()) with check (public.has_content_access());

-- ---------------- devotionals ----------------
create policy devotionals_read on public.devotionals
  for select to authenticated using (
    (scheduled_for is not null and scheduled_for <= now()) or public.has_content_access()
  );
create policy devotionals_content_write on public.devotionals
  for all to authenticated using (public.has_content_access()) with check (public.has_content_access());

-- ---------------- announcements ----------------
create policy announcements_auth_read on public.announcements
  for select to authenticated using (true);
create policy announcements_staff_write on public.announcements
  for all to authenticated using (public.has_staff_access()) with check (public.has_staff_access());

-- ---------------- photos ----------------
create policy photos_public_visible on public.photos
  for select to anon using (public_visible = true);
create policy photos_auth_read on public.photos
  for select to authenticated using (true);
create policy photos_staff_write on public.photos
  for all to authenticated using (public.has_staff_access()) with check (public.has_staff_access());

-- ---------------- waivers ----------------
create policy waivers_select_own_or_staff on public.waivers
  for select to authenticated using (user_id = auth.uid() or public.has_staff_access());
create policy waivers_insert_own on public.waivers
  for insert to authenticated with check (user_id = auth.uid());
create policy waivers_staff_all on public.waivers
  for all to authenticated using (public.has_staff_access()) with check (public.has_staff_access());

-- ---------------- inquiries ----------------
create policy inquiries_public_insert on public.inquiries
  for insert to anon with check (true);
create policy inquiries_auth_insert on public.inquiries
  for insert to authenticated with check (true);
create policy inquiries_staff_read on public.inquiries
  for select to authenticated using (public.has_staff_access());
create policy inquiries_staff_write on public.inquiries
  for all to authenticated using (public.has_staff_access()) with check (public.has_staff_access());
