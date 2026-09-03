import React, { useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { LOGOS, CSS } from "./App";

export default function SetPassword({ onDone }) {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [erreur, setErreur] = useState("");
  const [enCours, setEnCours] = useState(false);

  const valider = async (e) => {
    e.preventDefault();
    setErreur("");
    if (password.length < 6) {
      setErreur("Le mot de passe doit faire au moins 6 caractères.");
      return;
    }
    if (password !== password2) {
      setErreur("Les deux mots de passe ne sont pas identiques.");
      return;
    }
    setEnCours(true);
    const { error } = await supabase.auth.updateUser({ password });
    setEnCours(false);
    if (error) {
      setErreur("Impossible d'enregistrer ce mot de passe pour le moment.");
      return;
    }
    onDone && onDone();
  };

  return (
    <div className="pil">
      <style>{CSS}</style>
      <div className="wrap" style={{ maxWidth: 380, display: "flex",
                                      flexDirection: "column", alignItems: "center",
                                      justifyContent: "center", minHeight: "80vh" }}>
        <img src={LOGOS.life} alt="Tree of Life" style={{ height: 90, width: "auto", marginBottom: 22 }} />
        <form onSubmit={valider} className="card" style={{ width: "100%" }}>
          <h2 className="h2">Choisis ton mot de passe</h2>
          <div className="note" style={{ marginBottom: 14 }}>
            C'est ton premier accès (ou une réinitialisation). Choisis un mot de passe
            que tu retiendras : tu t'en serviras à chaque connexion.
          </div>
          <div style={{ marginBottom: 14 }}>
            <label className="f">Nouveau mot de passe</label>
            <input className="f" type="password" autoComplete="new-password" required
                   value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label className="f">Confirme-le</label>
            <input className="f" type="password" autoComplete="new-password" required
                   value={password2} onChange={(e) => setPassword2(e.target.value)} />
          </div>
          {erreur && <div className="note" style={{ color: "#B04A3B", marginBottom: 12 }}>{erreur}</div>}
          <button className="btn" type="submit" disabled={enCours} style={{ width: "100%" }}>
            {enCours ? "Enregistrement…" : "Valider"}
          </button>
        </form>
      </div>
    </div>
  );
}
