import React, { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "./lib/supabaseClient";
import Login from "./Login";
import App from "./App";
import { CSS } from "./App";

export default function AuthGate() {
  const [session, setSession] = useState(undefined); // undefined = pas encore su, null = déconnecté

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  if (!supabaseConfigured) {
    return (
      <div className="pil">
        <style>{CSS}</style>
        <div className="wrap">
          <div className="card">
            <h2 className="h2">Configuration manquante</h2>
            <div className="note">
              L'application n'est pas encore reliée à sa base de données. Il manque les
              variables d'environnement VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sur
              l'hébergement.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (session === undefined) {
    return (
      <div className="pil"><style>{CSS}</style>
        <div className="wrap"><div className="empty">Chargement…</div></div>
      </div>
    );
  }

  if (!session) return <Login />;

  return <App session={session} onLogout={() => supabase.auth.signOut()} />;
}
