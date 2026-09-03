import { supabase } from "./supabaseClient";

/**
 * Remplace le stockage clé/valeur fourni par l'environnement Artifact
 * (window.storage.get / window.storage.set) par une table Postgres
 * partagée sur Supabase. L'app d'origine (App.jsx) n'a pas été touchée :
 * elle continue d'appeler window.storage.get("pilotage:xxx") /
 * window.storage.set("pilotage:xxx", ...) exactement comme avant.
 *
 * Table attendue (voir supabase/schema.sql) :
 *   kv_store (key text primary key, value text, updated_at timestamptz)
 */
async function get(key) {
  const { data, error } = await supabase
    .from("kv_store")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error) {
    console.error("kvStorage.get", key, error);
    throw error;
  }
  if (!data) return null;
  return { value: data.value };
}

async function set(key, value) {
  const { error } = await supabase
    .from("kv_store")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) {
    console.error("kvStorage.set", key, error);
    throw error;
  }
  return { value };
}

export const kvStorage = { get, set };
