import { sites } from '@openai/sites-vite-plugin';
import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig } from 'vite';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
// Front-end estático: dispensa Worker/Miniflare e funciona em qualquer host.
export default defineConfig({
  resolve: {
    // Caminho absoluto também funciona no Linux do Netlify.
    alias: { '@': fileURLToPath(new URL('.', import.meta.url)) },
    // Os módulos locais já usam caminhos relativos e extensões explícitas.
    tsconfigPaths: false,
  },
  css: { postcss: { plugins: [tailwindcss()] } },
  // O pacote para GitHub/Netlify funciona sem os metadados locais do Sites.
  plugins: [vinext(), ...(existsSync('.openai/hosting.json') ? [sites()] : [])],
});
