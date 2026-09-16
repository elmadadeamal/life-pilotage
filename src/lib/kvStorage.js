import { supabase } from "./supabaseClient";

/**
 * Stockage clé/valeur partagé sur Supabase (table kv_store).
 *
 * Chaque ligne porte un jeton `version` que la base change elle-même à chaque
 * écriture (trigger kv_store_version). Ce jeton permet d'écrire « seulement si
 * personne n'a modifié depuis ma dernière lecture » : c'est ce qui empêche
 * Amal et SAIB, qui saisissent souvent en même temps, de s'effacer l'un
 * l'autre sans le savoir.
 *
 * Table attendue (voir supabase/schema.sql) :
 *   kv_store (key text primary key, value text, updated_at timestamptz, version text)
 */
async function get(key) {
  const { data, error } = await supabase
    .from("kv_store")
    .select("value, version")
    .eq("key", key)
    .maybeSingle();
  if (error) {
    console.error("kvStorage.get", key, error);
    throw error;
  }
  if (!data) return null;
  return { value: data.value, version: data.version };
}

/* Écriture sans condition : pour les clés qu'un seul écran touche. */
async function set(key, value) {
  const { data, error } = await supabase
    .from("kv_store")
    .upsert({ key, value }, { onConflict: "key" })
    .select("version")
    .maybeSingle();
  if (error) {
    console.error("kvStorage.set", key, error);
    throw error;
  }
  return { value, version: data ? data.version : null };
}

/**
 * Écriture conditionnelle.
 *
 * `attendue` est le jeton lu la dernière fois. Si la base porte encore ce
 * jeton, l'écriture passe et on renvoie { ok: true, version }. Si quelqu'un
 * est passé entre-temps, rien n'est écrit et on renvoie
 * { ok: false, value, version } — le contenu frais, pour que l'appelant
 * rejoue son geste dessus plutôt que de l'écraser.
 *
 * `attendue` à null vaut « la ligne ne devrait pas exister » : on insère.
 */
async function setIf(key, value, attendue) {
  if (attendue) {
    const { data, error } = await supabase
      .from("kv_store")
      .update({ value })
      .eq("key", key)
      .eq("version", attendue)
      .select("version");
    if (error) {
      console.error("kvStorage.setIf", key, error);
      throw error;
    }
    if (data && data.length > 0) return { ok: true, version: data[0].version };
  } else {
    const { data, error } = await supabase
      .from("kv_store")
      .insert({ key, value })
      .select("version");
    if (!error && data && data.length > 0) return { ok: true, version: data[0].version };
    /* 23505 = la ligne existe déjà : quelqu'un l'a créée avant nous. */
    if (error && error.code !== "23505") {
      console.error("kvStorage.setIf", key, error);
      throw error;
    }
  }
  const frais = await get(key);
  return { ok: false, value: frais ? frais.value : null,
           version: frais ? frais.version : null };
}

export const kvStorage = { get, set, setIf };
