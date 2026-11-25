// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Adresse définitive du site : à modifier dans .env (SITE_URL) ou ici.
const SITE_URL = process.env.SITE_URL || 'https://www.exemple-a-completer.fr';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Feuilles de style en fichiers externes : compatible avec une CSP stricte.
    inlineStylesheets: 'never',
  },
  vite: {
    build: { assetsInlineLimit: 0 },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/merci/'),
    }),
  ],
});
