-- Phase 1 hardening: keep helper/trigger functions off the public REST API.
-- Trigger function — never called directly.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Role helpers are used inside RLS policies evaluated as the `authenticated`
-- role, so authenticated must keep EXECUTE; anon never needs them.
revoke execute on function public.has_staff_access() from public, anon;
revoke execute on function public.has_content_access() from public, anon;
grant execute on function public.has_staff_access() to authenticated;
grant execute on function public.has_content_access() to authenticated;

-- Redundant: only the public (anon) inquiry form and staff need to insert.
drop policy if exists inquiries_auth_insert on public.inquiries;
