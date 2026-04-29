-- ============================================================
-- SAQUIC — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- BIRDS
create table if not exists birds (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name_en text not null,
  name_es text,
  breed text,
  sex char(1) default 'M',
  age_months integer default 0,
  bloodline text,
  weight_kg numeric(4,2),
  temperament text,
  egg_color text,
  hatch_date date,
  tags text[] default '{}',
  behaviors text[] default '{}',
  available boolean default false,
  father_id uuid references birds(id) on delete set null,
  mother_id uuid references birds(id) on delete set null,
  notes_en text,
  notes_es text,
  emoji text default '🐓',
  photo_url text
);

-- EGG LOGS
create table if not exists egg_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  bird_id uuid references birds(id) on delete cascade,
  log_date date not null,
  count integer default 0,
  egg_color text,
  egg_size text,
  notes_en text,
  notes_es text
);

-- HEALTH LOGS
create table if not exists health_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  bird_id uuid references birds(id) on delete cascade,
  log_date date not null,
  type text default 'observation',
  title_en text,
  title_es text,
  notes_en text,
  notes_es text,
  next_due date
);

-- HATCH LOGS
create table if not exists hatch_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  label_en text,
  label_es text,
  set_date date not null,
  eggs_set integer default 0,
  fertile integer,
  hatched integer,
  sire_id uuid references birds(id) on delete set null,
  dam_id uuid references birds(id) on delete set null,
  candling_d7 jsonb,
  candling_d14 jsonb,
  candling_d18 jsonb,
  notes_en text,
  notes_es text
);

-- WEIGHT LOGS
create table if not exists weight_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  bird_id uuid references birds(id) on delete cascade,
  log_date date not null,
  weight_kg numeric(5,3)
);

-- RLS: allow anon access (for demo/personal use)
-- For production, enable auth and restrict policies
alter table birds enable row level security;
alter table egg_logs enable row level security;
alter table health_logs enable row level security;
alter table hatch_logs enable row level security;
alter table weight_logs enable row level security;

create policy "allow all birds" on birds for all using (true) with check (true);
create policy "allow all egg_logs" on egg_logs for all using (true) with check (true);
create policy "allow all health_logs" on health_logs for all using (true) with check (true);
create policy "allow all hatch_logs" on hatch_logs for all using (true) with check (true);
create policy "allow all weight_logs" on weight_logs for all using (true) with check (true);

-- SEED demo data
insert into birds (name_en, name_es, breed, sex, age_months, bloodline, weight_kg, temperament, tags, behaviors, available, egg_color, emoji, hatch_date, notes_en, notes_es)
values
  ('El Rojo','El Rojo','Kelso Gamefowl','M',24,'Old Boston Kelso',2.4,'Aggressive','{show,breeder}','{aggressive,active}',false,null,'🐓','2022-04-15','Champion bloodline, sharp reflexes.','Línea campeona, reflejos agudos.'),
  ('Reina','Reina','Rhode Island Red','F',18,'Mahogany Line',2.9,'Calm','{breeder}','{calm,vocal}',true,'brown','🐔','2022-10-01','Excellent layer, very consistent.','Excelente ponedora, muy consistente.'),
  ('Luna','Luna','Ameraucana','F',14,'Blue Beard',2.2,'Calm','{for-sale}','{broody,calm}',true,'blue','🐔','2023-02-20','Lays beautiful blue eggs.','Pone hermosos huevos azules.'),
  ('Titan','Titán','Brahma','M',30,'Dark Brahma Heritage',5.1,'Gentle','{breeder,show}','{calm,active}',false,null,'🐓','2021-10-10','Gentle giant, excellent sire.','Gigante gentil, excelente semental.'),
  ('Blanca','Blanca','Leghorn','F',12,'Single Comb White',1.8,'Active','{breeder}','{active,vocal}',true,'white','🐔','2023-04-05','Top producer, lays daily.','Mejor productora, pone a diario.'),
  ('Shadow','Sombra','Sweater Gamefowl','M',20,'Sweater Grey',2.1,'Aggressive','{show}','{aggressive}',false,null,'🐓','2022-08-12','Fast and high-stationed.','Rápido y de alta estatura.');
