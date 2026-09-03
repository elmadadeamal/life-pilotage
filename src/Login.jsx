import React, { useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { LOGOS, CSS } from "./App";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState("");
  const [enCours, setEnCours] = useState(false);

  const connecter = async (e) => {
    e.preventDefault();
    setErreur("");
    setEnCours(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setEnCours(false);
    if (error) {
      setErreur(
        error.message === "Invalid login credentials"
          ? "Email ou mot de passe incorrect."
          : "Connexion impossible pour le moment."
      );
    }
  };

  return (
    <div className="pil">
      <style>{CSS}</style>
      <div className="wrap" style={{ maxWidth: 380, display: "flex",
                                      flexDirection: "column", alignItems: "center",
                                      justifyContent: "center", minHeight: "80vh" }}>
        <img src={LOGOS.life} alt="Tree of Life" style={{ height: 90, width: "auto", marginBottom: 22 }} />
        <form onSubmit={connecter} className="card" style={{ width: "100%" }}>
          <h2 className="h2">Connexion</h2>
          <div style={{ marginBottom: 14 }}>
            <label className="f">Email</label>
            <input className="f" type="email" autoComplete="username" required
                   value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label className="f">Mot de passe</label>
            <input className="f" type="password" autoComplete="current-password" required
                   value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {erreur && <div className="note" style={{ color: "#B04A3B", marginBottom: 12 }}>{erreur}</div>}
          <button className="btn" type="submit" disabled={enCours} style={{ width: "100%" }}>
            {enCours ? "Connexion…" : "Se connecter"}
          </button>
        </form>
        <div className="mini" style={{ marginTop: 18, textAlign: "center" }}>
          Accès réservé. Pas de compte ? Demande à AMAL de t'en créer un.
        </div>
      </div>
    </div>
  );
}
