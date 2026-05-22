-- Phase 4: flexible info pages + a private bucket for waiver signatures.

create table public.trip_pages (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips (id) on delete cascade,
  slug text not null,
  title text not null,
  content text,
  sort_order int not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  unique (trip_id, slug)
);

create index idx_trip_pages_trip on public.trip_pages (trip_id, sort_order);

alter table public.trip_pages enable row level security;

create policy trip_pages_read on public.trip_pages
  for select to authenticated using (visible = true or public.has_staff_access());
create policy trip_pages_staff_write on public.trip_pages
  for all to authenticated using (public.has_staff_access()) with check (public.has_staff_access());

-- Private bucket for finger-signed waiver PNGs.
insert into storage.buckets (id, name, public)
values ('signatures', 'signatures', false)
on conflict (id) do nothing;

-- Each user can write/read their own folder ({uid}/...); staff can read all.
create policy signatures_insert_own on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'signatures'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy signatures_select_own_or_staff on storage.objects
  for select to authenticated
  using (
    bucket_id = 'signatures'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.has_staff_access())
  );
