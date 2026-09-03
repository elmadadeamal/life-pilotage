-- ============================================================================
-- LIFE — schéma Supabase
-- À coller une seule fois dans Supabase : Project > SQL Editor > New query,
-- puis "Run". Sans risque à relancer (idempotent).
-- ============================================================================

-- 1) La table qui contient toutes les données de l'app (config, ventes,
--    dépenses, tâches...). L'app y stocke quelques grosses valeurs JSON,
--    une par grande rubrique — exactement comme elle le faisait avant dans
--    son stockage d'origine, seule la destination change.
create table if not exists public.kv_store (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now()
);

-- 2) On verrouille la table : personne ne peut la lire ou l'écrire sans être
--    connecté, et seuls les deux comptes autorisés ci-dessous peuvent se
--    connecter (la création de compte public est désactivée séparément dans
--    Authentication > Providers > Email > "Allow new users to sign up").
alter table public.kv_store enable row level security;

drop policy if exists "kv_store_allowed_users" on public.kv_store;
create policy "kv_store_allowed_users"
  on public.kv_store
  for all
  to authenticated
  using (
    (auth.jwt() ->> 'email') in (
      'elmadadeamal@gmail.com',
      'EMAIL_DE_SAIB_A_REMPLACER'
    )
  )
  with check (
    (auth.jwt() ->> 'email') in (
      'elmadadeamal@gmail.com',
      'EMAIL_DE_SAIB_A_REMPLACER'
    )
  );

-- 3) Realtime : chaque modification (par l'un ou l'autre) est poussée en
--    direct à l'autre appareil connecté, sans recharger la page.
alter publication supabase_realtime add table public.kv_store;

-- ============================================================================
-- Après avoir lancé ce script :
--  1. Remplacer EMAIL_DE_SAIB_A_REMPLACER ci-dessus par la vraie adresse de
--     SAIB, puis relancer le script (les deux "create policy" se remplacent
--     proprement grâce au "drop policy if exists").
--  2. Authentication > Providers > Email > désactiver "Allow new users to
--     sign up" (personne d'autre ne doit pouvoir créer de compte).
--  3. Authentication > Users > Add user > créer un compte pour toi et un
--     compte pour SAIB (email + mot de passe), en cochant "Auto Confirm User".
-- ============================================================================
