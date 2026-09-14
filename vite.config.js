import { sites } from '@openai/sites-vite-plugin';
import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig } from 'vite';
import { existsSync } from 'node:fs';
// Front-end estático: dispensa Worker/Miniflare e funciona em qualquer host.
export default defineConfig({
  css: { postcss: { plugins: [tailwindcss()] } },
  // O pacote para GitHub/Netlify funciona sem os metadados locais do Sites.
  plugins: [vinext(), ...(existsSync('.openai/hosting.json') ? [sites()] : [])],
});
