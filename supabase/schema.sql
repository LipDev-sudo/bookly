-- ============================================================
-- Bookly — database schema
-- Copy this entire file and run in:
--   Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- ---------- Extensions ----------
create extension if not exists "uuid-ossp";

-- ============================================================
-- Tables
-- ============================================================

-- One business per user (multi-tenant root)
create table if not exists public.businesses (
  id          uuid primary key default uuid_generate_v4(),
  owner_id    uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  slug        text unique,
  timezone    text not null default 'America/Sao_Paulo',
  currency    text not null default 'BRL',
  plan        text not null default 'free' check (plan in ('free', 'pro')),
  stripe_customer_id     text,
  stripe_subscription_id text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists businesses_owner_id_idx on public.businesses(owner_id);

-- Clients of the business
create table if not exists public.clients (
  id           uuid primary key default uuid_generate_v4(),
  business_id  uuid not null references public.businesses(id) on delete cascade,
  name         text not null,
  email        text,
  phone        text,
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists clients_business_id_idx on public.clients(business_id);

-- Services offered by the business
create table if not exists public.services (
  id              uuid primary key default uuid_generate_v4(),
  business_id     uuid not null references public.businesses(id) on delete cascade,
  name            text not null,
  description     text,
  duration_min    int  not null default 60,
  price_cents     int  not null default 0,
  active          boolean not null default true,
  created_at      timestamptz not null default now()
);

create index if not exists services_business_id_idx on public.services(business_id);

-- Appointments (the heart of the app)
create table if not exists public.appointments (
  id           uuid primary key default uuid_generate_v4(),
  business_id  uuid not null references public.businesses(id) on delete cascade,
  client_id    uuid not null references public.clients(id) on delete cascade,
  service_id   uuid not null references public.services(id) on delete restrict,
  starts_at    timestamptz not null,
  ends_at      timestamptz not null,
  status       text not null default 'scheduled'
                  check (status in ('scheduled', 'completed', 'canceled', 'no_show')),
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists appointments_business_id_idx  on public.appointments(business_id);
create index if not exists appointments_starts_at_idx    on public.appointments(starts_at);
create index if not exists appointments_client_id_idx    on public.appointments(client_id);

-- ============================================================
-- updated_at triggers
-- ============================================================

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_businesses_updated   on public.businesses;
drop trigger if exists trg_clients_updated      on public.clients;
drop trigger if exists trg_appointments_updated on public.appointments;

create trigger trg_businesses_updated   before update on public.businesses
  for each row execute procedure public.set_updated_at();
create trigger trg_clients_updated      before update on public.clients
  for each row execute procedure public.set_updated_at();
create trigger trg_appointments_updated before update on public.appointments
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- Row Level Security
-- Each user only sees data tied to a business they own.
-- ============================================================

alter table public.businesses   enable row level security;
alter table public.clients      enable row level security;
alter table public.services     enable row level security;
alter table public.appointments enable row level security;

-- businesses: owner only
drop policy if exists "businesses owner read"   on public.businesses;
drop policy if exists "businesses owner write"  on public.businesses;

create policy "businesses owner read" on public.businesses
  for select using (owner_id = auth.uid());

create policy "businesses owner write" on public.businesses
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- helper: is the current user the owner of this business?
create or replace function public.is_business_owner(b_id uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.businesses
    where id = b_id and owner_id = auth.uid()
  );
$$;

-- clients
drop policy if exists "clients owner all" on public.clients;
create policy "clients owner all" on public.clients
  for all using (public.is_business_owner(business_id))
  with check (public.is_business_owner(business_id));

-- services
drop policy if exists "services owner all" on public.services;
create policy "services owner all" on public.services
  for all using (public.is_business_owner(business_id))
  with check (public.is_business_owner(business_id));

-- appointments
drop policy if exists "appointments owner all" on public.appointments;
create policy "appointments owner all" on public.appointments
  for all using (public.is_business_owner(business_id))
  with check (public.is_business_owner(business_id));

-- ============================================================
-- Auto-create a business on user signup
-- ============================================================

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.businesses (owner_id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'business_name', 'My Business'));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
