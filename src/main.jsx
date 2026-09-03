import React from "react";
import ReactDOM from "react-dom/client";
import { kvStorage } from "./lib/kvStorage";
import AuthGate from "./AuthGate";

// L'app d'origine (App.jsx) lit et écrit ses données via window.storage,
// l'API fournie par son environnement de départ. On branche ici la même
// interface, mais reliée à Supabase, sans toucher au reste du code.
window.storage = kvStorage;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthGate />
  </React.StrictMode>
);
