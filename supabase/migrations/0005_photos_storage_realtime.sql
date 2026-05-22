-- Phase 6 core: public photos bucket, staff write, realtime on photos.

insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

-- Public bucket = anyone can read via the public URL. Writes are staff-only.
create policy photos_staff_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'photos' and public.has_staff_access());

create policy photos_staff_update on storage.objects
  for update to authenticated
  using (bucket_id = 'photos' and public.has_staff_access());

create policy photos_staff_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'photos' and public.has_staff_access());

-- Live photo drops during the trip.
do $$
begin
  alter publication supabase_realtime add table public.photos;
exception when others then null;
end $$;
