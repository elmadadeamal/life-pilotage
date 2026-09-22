-- ============================================================================
-- LIFE — schéma Supabase
-- ============================================================================
-- Ce fichier doit rester le miroir exact de la base en service. Il lui manquait
-- la colonne \`version\` et son trigger : sans eux, kvStorage.setIf ne protège
-- plus rien et les deux appareils s'écrasent l'un l'autre en silence.

create table if not exists public.kv_store (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now(),
  version    text not null default gen_random_uuid()::text
);

alter table public.kv_store
  add column if not exists version text not null default gen_random_uuid()::text;

-- Le jeton change à CHAQUE écriture : c'est lui qui permet d'écrire
-- « seulement si personne n'est passé depuis ma dernière lecture ».
create or replace function public.kv_store_bump_version()
returns trigger
language plpgsql
as $$
begin
  new.version    := gen_random_uuid()::text;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists kv_store_version on public.kv_store;
create trigger kv_store_version
  before insert or update on public.kv_store
  for each row execute function public.kv_store_bump_version();

alter table public.kv_store enable row level security;

drop policy if exists "kv_store_allowed_users" on public.kv_store;
create policy "kv_store_allowed_users"
  on public.kv_store
  for all
  to authenticated
  using (true)
  with check (true);

-- La synchronisation en direct entre les deux appareils.
alter publication supabase_realtime add table public.kv_store;
