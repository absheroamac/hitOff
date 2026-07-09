-- Run this if you already applied the original schema.sql and need to upgrade in place.
-- Adds a solo/team mode to completions, and relaxes insert/delete policies so a "team"
-- completion can write a row for your partner too (this is a 2-person shared app, not multi-tenant).

alter table public.completions
  add column if not exists mode text not null default 'solo' check (mode in ('solo', 'team'));

drop policy if exists "users can insert their own completions" on public.completions;
drop policy if exists "users can delete their own completions" on public.completions;

create policy "any authenticated user can insert completions"
  on public.completions for insert
  to authenticated
  with check (true);

create policy "any authenticated user can delete completions"
  on public.completions for delete
  to authenticated
  using (true);
