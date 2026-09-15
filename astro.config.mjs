// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// Site estático por padrão; só o endpoint /api/disponibilidade roda como
// função serverless (via `export const prerender = false` no próprio arquivo).
export default defineConfig({
  site: 'https://sppa.com.br',
  adapter: vercel(),
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
