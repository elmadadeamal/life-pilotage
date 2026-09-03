-- ============================================================================
-- LIFE — schéma Supabase
-- ============================================================================

create table if not exists public.kv_store (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now()
);

alter table public.kv_store enable row level security;

drop policy if exists "kv_store_allowed_users" on public.kv_store;
create policy "kv_store_allowed_users"
  on public.kv_store
  for all
  to authenticated
  using (true)
  with check (true);

alter publication supabase_realtime add table public.kv_store;
