-- Recipe Saver schema

create table recipes (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  ingredients jsonb not null default '[]',
  photo       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table menus (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  recipe_ids    jsonb not null default '[]',
  family_id     uuid,
  family_name   text,
  contributions jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table families (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamptz not null default now()
);

create table members (
  id         uuid primary key default gen_random_uuid(),
  family_id  uuid not null references families(id) on delete cascade,
  name       text not null,
  color      text not null,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table recipes  enable row level security;
alter table menus    enable row level security;
alter table families enable row level security;
alter table members  enable row level security;

-- Allow public (anon) full access to all tables
create policy "public access" on recipes  for all using (true) with check (true);
create policy "public access" on menus    for all using (true) with check (true);
create policy "public access" on families for all using (true) with check (true);
create policy "public access" on members  for all using (true) with check (true);
