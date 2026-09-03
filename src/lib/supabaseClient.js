import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Ce message n'apparaît que si le déploiement a oublié de configurer
  // les deux variables d'environnement (voir README.md).
  console.error(
    "Configuration Supabase manquante : VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY " +
    "doivent être définies (fichier .env en local, variables d'environnement sur l'hébergeur)."
  );
}

export const supabase = createClient(url || "https://placeholder.supabase.co", anonKey || "placeholder");
export const supabaseConfigured = Boolean(url && anonKey);
