-- ==========================================================================
-- MISSI INNOVATION — SUPABASE SCHEMA & ROW LEVEL SECURITY (BOOKINGS + ADMIN)
-- Execute once in Supabase SQL Editor (Project: uigqxexsfbjfxbnkrjfc)
-- ==========================================================================

create extension if not exists pgcrypto;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  market text not null check (market in ('intl-fr', 'intl-en', 'local-mg')),
  lang text not null check (lang in ('fr', 'en')),
  full_name text not null check (char_length(trim(full_name)) between 2 and 120),
  organization text check (organization is null or char_length(organization) <= 160),
  whatsapp text check (whatsapp is null or char_length(whatsapp) <= 40),
  email text check (email is null or char_length(email) <= 160),
  service_pole text not null check (char_length(trim(service_pole)) between 2 and 160),
  preferred_date date not null,
  preferred_slot text not null check (preferred_slot in ('09:00-11:00', '11:00-13:00', '14:00-16:00', '16:00-18:00')),
  visitor_timezone text,
  message text check (message is null or char_length(message) <= 600),
  status text not null default 'Nouveau' check (status in ('Nouveau', 'Confirmé', 'Démo effectuée', 'Devis envoyé', 'Signé', 'Archivé')),
  internal_notes text default '',
  constraint booking_contact_required check (
    coalesce(nullif(trim(whatsapp), ''), nullif(trim(email), '')) is not null
  )
);

alter table public.bookings enable row level security;

-- Clean existing policies if re-running
drop policy if exists "anon_insert_bookings" on public.bookings;
drop policy if exists "admin_select_bookings" on public.bookings;
drop policy if exists "admin_update_bookings" on public.bookings;
drop policy if exists "admin_delete_bookings" on public.bookings;

-- 1. Public visitors (anon): INSERT ONLY, forced initial status = 'Nouveau'
create policy "anon_insert_bookings"
  on public.bookings
  for insert
  to anon
  with check (status = 'Nouveau');

-- 2. Authenticated Admin users ONLY: full read / update / delete
-- Note: Keep Supabase "Disable new user signups" ON in Auth settings so only your admin account exists.
create policy "admin_select_bookings"
  on public.bookings
  for select
  to authenticated
  using ((auth.jwt() ->> 'email') = 'missiinnovation@gmail.com');

create policy "admin_update_bookings"
  on public.bookings
  for update
  to authenticated
  using ((auth.jwt() ->> 'email') = 'missiinnovation@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'missiinnovation@gmail.com');

create policy "admin_delete_bookings"
  on public.bookings
  for delete
  to authenticated
  using ((auth.jwt() ->> 'email') = 'missiinnovation@gmail.com');

create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
create index if not exists bookings_status_idx on public.bookings (status);
