import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base relatif : fonctionne aussi bien sur GitHub Pages (sous-dossier)
// que sur un domaine racine (Netlify, Vercel, etc.).
export default defineConfig({
  plugins: [react()],
  base: "./",
});
