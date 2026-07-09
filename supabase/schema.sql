-- HitOff schema
-- Run this in the Supabase SQL editor for your project.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Fighter',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are readable by any authenticated user"
  on public.profiles for select
  to authenticated
  using (true);

create policy "users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- One row per (user, task, week, day) completion. Task ids come from src/data/program.ts.
-- mode records whether the task was done solo (tracked for that person only) or as a
-- team (the app writes one row per partner, so it counts for both).
create table if not exists public.completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_number int not null,
  day_id text not null,
  task_id text not null,
  mode text not null default 'solo' check (mode in ('solo', 'team')),
  completed_at timestamptz not null default now(),
  unique (user_id, week_number, day_id, task_id)
);

alter table public.completions enable row level security;

create policy "completions are readable by any authenticated user"
  on public.completions for select
  to authenticated
  using (true);

-- Permissive by design: this is a two-person shared-progress app, not a multi-tenant one.
-- A team completion needs to write a row for the *other* partner's user_id, so inserts/deletes
-- aren't restricted to auth.uid() = user_id the way profiles are.
create policy "any authenticated user can insert completions"
  on public.completions for insert
  to authenticated
  with check (true);

create policy "any authenticated user can delete completions"
  on public.completions for delete
  to authenticated
  using (true);

-- Auto-create a profile row when a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
