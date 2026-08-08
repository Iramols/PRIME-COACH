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
  photo_path text,
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
  photo_path text,
  created_at timestamptz not null default now()
);

-- "Test resultaten" is hernoemd naar "Lenigheid" met specifieke velden
-- i.p.v. generieke col1/col2/col3. Migreert een bestaande tabel/kolommen
-- zonder data te verliezen; op een verse install bestaat "test_results"
-- niet en gebeurt er hier niets.
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'test_results') then
    alter table public.test_results rename to lenigheid_testen;
  end if;
end $$;

do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'lenigheid_testen' and column_name = 'col1') then
    alter table public.lenigheid_testen rename column col1 to sit_reach_cm;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'lenigheid_testen' and column_name = 'col2') then
    alter table public.lenigheid_testen rename column col2 to shoulder_stretch_cm;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'lenigheid_testen' and column_name = 'col3') then
    alter table public.lenigheid_testen rename column col3 to straight_leg_bend_cm;
  end if;
end $$;

-- Lenigheid: sit & reach, schouderstretch, buigen met gestrekte knieën (alle in cm)
create table if not exists public.lenigheid_testen (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  log_date date not null default current_date,
  sit_reach_cm numeric(5,1),
  shoulder_stretch_cm numeric(5,1),
  straight_leg_bend_cm numeric(5,1),
  photo_path text,
  created_at timestamptz not null default now()
);

-- Uithoudingsvermogen > Max aerobe testen
create table if not exists public.max_aerobe_testen (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  log_date date not null default current_date,
  six_min_loop_m numeric(6,1),
  shuttle_run_m numeric(6,1),
  cooper_test_m numeric(6,1),
  one_mile_time text,
  photo_path text,
  created_at timestamptz not null default now()
);

-- Uithoudingsvermogen > Sub max aerobe testen
create table if not exists public.sub_max_aerobe_testen (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  log_date date not null default current_date,
  astrand_vo2max_lmin numeric(5,2),
  six_min_walk_m numeric(6,1),
  photo_path text,
  created_at timestamptz not null default now()
);

-- Uithoudingsvermogen > Anaerobe testen
create table if not exists public.anaerobe_testen (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  log_date date not null default current_date,
  quebec_10s_watt numeric(6,1),
  vertical_jump_cm numeric(5,1),
  wingate_watt numeric(6,1),
  photo_path text,
  created_at timestamptz not null default now()
);

-- Kracht
create table if not exists public.kracht_testen (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  log_date date not null default current_date,
  reverse_pushup_cm numeric(5,1),
  grip_strength_kg numeric(5,1),
  pushups_30s numeric(4,0),
  leg_raise_time text,
  wall_sit_sec numeric(5,1),
  standing_long_jump_cm numeric(5,1),
  situps_per_min numeric(4,0),
  plank_time text,
  one_rm_kg numeric(5,1),
  one_rm_estimate_kg numeric(5,1),
  photo_path text,
  created_at timestamptz not null default now()
);

-- Snelheid
create table if not exists public.snelheid_testen (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  log_date date not null default current_date,
  ten_x_5m_loop_sec numeric(4,1),
  fast_feet_sec numeric(5,1),
  t_test_sec numeric(5,1),
  photo_path text,
  created_at timestamptz not null default now()
);

-- Coördinatie
create table if not exists public.coordinatie_testen (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  log_date date not null default current_date,
  indian_hop_test numeric(4,0),
  hexagon_obstacle_test numeric(4,0),
  photo_path text,
  created_at timestamptz not null default now()
);

-- Vetpercentage (huidplooimetingen)
create table if not exists public.vetpercentage_testen (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  log_date date not null default current_date,
  triceps_skinfold_mm numeric(5,1),
  biceps_skinfold_mm numeric(5,1),
  subscapular_skinfold_mm numeric(5,1),
  suprailiac_skinfold_mm numeric(5,1),
  photo_path text,
  created_at timestamptz not null default now()
);

-- PWC170 is op verzoek weer verwijderd uit Max aerobe testen
alter table public.max_aerobe_testen drop column if exists pwc170_watt;

-- Bestaande tabellen (indien al eerder aangemaakt zonder foto-kolom) bijwerken
alter table public.notes add column if not exists photo_path text;
alter table public.results add column if not exists photo_path text;
alter table public.lenigheid_testen add column if not exists photo_path text;

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
alter table public.lenigheid_testen enable row level security;
alter table public.max_aerobe_testen enable row level security;
alter table public.sub_max_aerobe_testen enable row level security;
alter table public.anaerobe_testen enable row level security;
alter table public.kracht_testen enable row level security;
alter table public.snelheid_testen enable row level security;
alter table public.coordinatie_testen enable row level security;
alter table public.vetpercentage_testen enable row level security;

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

drop policy if exists "coach manages test_results of own clients" on public.lenigheid_testen;
drop policy if exists "coach manages lenigheid_testen of own clients" on public.lenigheid_testen;
create policy "coach manages lenigheid_testen of own clients" on public.lenigheid_testen
  for all
  using (exists (select 1 from public.clients c where c.id = lenigheid_testen.client_id and c.coach_id = auth.uid()))
  with check (exists (select 1 from public.clients c where c.id = lenigheid_testen.client_id and c.coach_id = auth.uid()));

drop policy if exists "coach manages max_aerobe_testen of own clients" on public.max_aerobe_testen;
create policy "coach manages max_aerobe_testen of own clients" on public.max_aerobe_testen
  for all
  using (exists (select 1 from public.clients c where c.id = max_aerobe_testen.client_id and c.coach_id = auth.uid()))
  with check (exists (select 1 from public.clients c where c.id = max_aerobe_testen.client_id and c.coach_id = auth.uid()));

drop policy if exists "coach manages sub_max_aerobe_testen of own clients" on public.sub_max_aerobe_testen;
create policy "coach manages sub_max_aerobe_testen of own clients" on public.sub_max_aerobe_testen
  for all
  using (exists (select 1 from public.clients c where c.id = sub_max_aerobe_testen.client_id and c.coach_id = auth.uid()))
  with check (exists (select 1 from public.clients c where c.id = sub_max_aerobe_testen.client_id and c.coach_id = auth.uid()));

drop policy if exists "coach manages anaerobe_testen of own clients" on public.anaerobe_testen;
create policy "coach manages anaerobe_testen of own clients" on public.anaerobe_testen
  for all
  using (exists (select 1 from public.clients c where c.id = anaerobe_testen.client_id and c.coach_id = auth.uid()))
  with check (exists (select 1 from public.clients c where c.id = anaerobe_testen.client_id and c.coach_id = auth.uid()));

drop policy if exists "coach manages kracht_testen of own clients" on public.kracht_testen;
create policy "coach manages kracht_testen of own clients" on public.kracht_testen
  for all
  using (exists (select 1 from public.clients c where c.id = kracht_testen.client_id and c.coach_id = auth.uid()))
  with check (exists (select 1 from public.clients c where c.id = kracht_testen.client_id and c.coach_id = auth.uid()));

drop policy if exists "coach manages snelheid_testen of own clients" on public.snelheid_testen;
create policy "coach manages snelheid_testen of own clients" on public.snelheid_testen
  for all
  using (exists (select 1 from public.clients c where c.id = snelheid_testen.client_id and c.coach_id = auth.uid()))
  with check (exists (select 1 from public.clients c where c.id = snelheid_testen.client_id and c.coach_id = auth.uid()));

drop policy if exists "coach manages coordinatie_testen of own clients" on public.coordinatie_testen;
create policy "coach manages coordinatie_testen of own clients" on public.coordinatie_testen
  for all
  using (exists (select 1 from public.clients c where c.id = coordinatie_testen.client_id and c.coach_id = auth.uid()))
  with check (exists (select 1 from public.clients c where c.id = coordinatie_testen.client_id and c.coach_id = auth.uid()));

drop policy if exists "coach manages vetpercentage_testen of own clients" on public.vetpercentage_testen;
create policy "coach manages vetpercentage_testen of own clients" on public.vetpercentage_testen
  for all
  using (exists (select 1 from public.clients c where c.id = vetpercentage_testen.client_id and c.coach_id = auth.uid()))
  with check (exists (select 1 from public.clients c where c.id = vetpercentage_testen.client_id and c.coach_id = auth.uid()));

-- Foto's bij Notities/Resultaten/Lenigheid/Uithoudingsvermogen/Kracht/Snelheid: privé Storage bucket.
-- Bestandspad is altijd "<client_id>/<bestandsnaam>" — de policy hieronder
-- controleert dat de map (client_id) bij een klant van de ingelogde coach hoort.
insert into storage.buckets (id, name, public)
values ('log-photos', 'log-photos', false)
on conflict (id) do nothing;

drop policy if exists "coach manages photos of own clients" on storage.objects;
create policy "coach manages photos of own clients" on storage.objects
  for all
  using (
    bucket_id = 'log-photos'
    and exists (
      select 1 from public.clients c
      where c.id::text = (storage.foldername(objects.name))[1]
        and c.coach_id = auth.uid()
    )
  )
  with check (
    bucket_id = 'log-photos'
    and exists (
      select 1 from public.clients c
      where c.id::text = (storage.foldername(objects.name))[1]
        and c.coach_id = auth.uid()
    )
  );
