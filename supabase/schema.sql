-- Leefstijlcoach App - database schema
-- Uitvoeren in de Supabase SQL Editor van je project.

-- Klantdossiers (profiel-gegevens per klant)
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null default 'Nieuwe klant',
  age integer,
  weight_kg numeric(5,2),
  height_cm numeric(5,1),
  gender text,
  goal text,
  activity_level text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Notities: logboek van voeding/training/bijzonderheden per datum
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  log_date date not null default current_date,
  nutrition text,
  training text,
  remarks text,
  created_at timestamptz not null default now()
);

-- Resultaten: metingen per datum (BMI wordt berekend in de app uit gewicht + lengte)
create table if not exists public.results (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  log_date date not null default current_date,
  weight_kg numeric(5,2),
  fat_pct numeric(4,1),
  waist_cm numeric(5,1),
  visceral_fat numeric(4,1),
  muscle_mass_kg numeric(5,2),
  muscle_mass_pct numeric(4,1),
  created_at timestamptz not null default now()
);

-- Test resultaten: 3 nader te bepalen kolommen + datum
create table if not exists public.test_results (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  log_date date not null default current_date,
  col1 text,
  col2 text,
  col3 text,
  created_at timestamptz not null default now()
);

-- updated_at automatisch bijwerken op clients
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists clients_set_updated_at on public.clients;
create trigger clients_set_updated_at
before update on public.clients
for each row execute function public.set_updated_at();

-- Row Level Security: de coach ziet en beheert alleen zijn/haar eigen klantdossiers
alter table public.clients enable row level security;
alter table public.notes enable row level security;
alter table public.results enable row level security;
alter table public.test_results enable row level security;

drop policy if exists "coach manages own clients" on public.clients;
create policy "coach manages own clients" on public.clients
  for all
  using (coach_id = auth.uid())
  with check (coach_id = auth.uid());

drop policy if exists "coach manages notes of own clients" on public.notes;
create policy "coach manages notes of own clients" on public.notes
  for all
  using (exists (select 1 from public.clients c where c.id = notes.client_id and c.coach_id = auth.uid()))
  with check (exists (select 1 from public.clients c where c.id = notes.client_id and c.coach_id = auth.uid()));

drop policy if exists "coach manages results of own clients" on public.results;
create policy "coach manages results of own clients" on public.results
  for all
  using (exists (select 1 from public.clients c where c.id = results.client_id and c.coach_id = auth.uid()))
  with check (exists (select 1 from public.clients c where c.id = results.client_id and c.coach_id = auth.uid()));

drop policy if exists "coach manages test_results of own clients" on public.test_results;
create policy "coach manages test_results of own clients" on public.test_results
  for all
  using (exists (select 1 from public.clients c where c.id = test_results.client_id and c.coach_id = auth.uid()))
  with check (exists (select 1 from public.clients c where c.id = test_results.client_id and c.coach_id = auth.uid()));
