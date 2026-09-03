# LIFE — pilotage

Version en ligne de l'app "LIFE", prête à être partagée avec SAIB. Le
contenu et le fonctionnement de l'app n'ont pas changé : seul l'endroit où
les données sont stockées a changé (Supabase au lieu du stockage local de
l'aperçu Claude), pour que toi et SAIB puissiez saisir depuis vos téléphones
et voir les mêmes chiffres, mis à jour en direct.

Voir la conversation Claude pour la liste précise des comptes à créer et
des accès à donner.

## Développement local

```bash
npm install
cp .env.example .env   # puis renseigner les deux valeurs Supabase
npm run dev
```

## Build de production

```bash
npm run build   # produit le dossier dist/
```

## Déploiement

Le dépôt contient un workflow GitHub Actions (`.github/workflows/deploy.yml`)
qui construit et publie automatiquement le site sur GitHub Pages à chaque
`git push` sur `main`. Il lui faut deux secrets de dépôt :
`VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
(Settings > Secrets and variables > Actions).

## Base de données

Le schéma SQL à exécuter une fois dans Supabase (SQL Editor) est dans
`supabase/schema.sql`.
