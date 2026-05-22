-- Seed data for The Pintail Experience (single inaugural trip, v1).
insert into public.trips (slug, name, start_date, end_date, status)
values ('december-2026', 'The Pintail Experience', '2026-12-30', '2027-01-01', 'live')
on conflict (slug) do nothing;
